import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentComponent } from '../../components/component/component.component';
import { ComponentContent } from '../../common/ComponentContent';
import { ComponentService } from '../../components/componentService';
import { ComponentStateInfoComponent } from '../../common/component-state-info/component-state-info.component';
import { ConfigService } from '../../services/configService';
import { ConstraintService } from '../../services/constraintService';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HelpIconComponent } from '../../themes/default/themeComponents/helpIcon/help-icon.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { NodeComponent } from '../node/node.component';
import { NodeStatusService } from '../../services/nodeStatusService';
import { SessionService } from '../../services/sessionService';
import { StudentDataService } from '../../services/studentDataService';
import { StudentNodeService } from '../../services/studentNodeService';
import { SubmitSurveyComponent } from '../submit-survey/submit-survey.component';
import { TimedNodeService } from '../../services/timedNodeService';
import { VLEProjectService } from '../vleProjectService';

@Component({
  imports: [
    CommonModule,
    ComponentComponent,
    ComponentStateInfoComponent,
    FlexLayoutModule,
    HelpIconComponent,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    SubmitSurveyComponent
  ],
  selector: 'timed-node',
  styleUrl: './timed-node.component.scss',
  templateUrl: './timed-node.component.html'
})
export class TimedNodeComponent extends NodeComponent {
  private componentTimers: number[];
  private currentComponentIndex = 0;
  private currentInterval: any;
  protected stepCompleted = false;
  protected timerCountDown: number;

  constructor(
    protected componentService: ComponentService,
    protected configService: ConfigService,
    protected constraintService: ConstraintService,
    protected nodeService: StudentNodeService,
    protected nodeStatusService: NodeStatusService,
    protected projectService: VLEProjectService,
    protected sessionService: SessionService,
    protected studentDataService: StudentDataService,
    private timedNodeService: TimedNodeService
  ) {
    super(
      componentService,
      configService,
      constraintService,
      nodeService,
      nodeStatusService,
      projectService,
      sessionService,
      studentDataService
    );
  }

  async ngOnInit(): Promise<void> {
    super.ngOnInit();
    await this.skipViewedComponents();
    this.timedNodeService.broadcastIsNodeCompleted(this.stepCompleted);
    if (!this.stepCompleted) {
      this.componentTimers = this.node.components.map((component: ComponentContent) => {
        return component.timeLimit ?? 0;
      });
      this.components.forEach((component, index) => {
        this.componentToVisible[component.id] = index === this.currentComponentIndex;
      });
      this.startComponentTimer();
    }
  }

  private async skipViewedComponents(): Promise<void> {
    if (!this.isPreview()) {
      const studentWork = await this.studentDataService.retrieveStudentDataForSignedInStudent();
      const componentsViewed = studentWork.events
        .filter((event) => event.event === 'componentViewed')
        .map((event) => event.componentId);
      this.advanceCurrentComponentIndex(componentsViewed);
      this.setStepCompletedIfNecessary();
    }
  }

  private advanceCurrentComponentIndex(componentsViewed: string[]): void {
    this.node.components.forEach((component, componentIndex) => {
      if (componentsViewed.includes(component.id) && componentIndex >= this.currentComponentIndex) {
        this.currentComponentIndex = componentIndex + 1;
      }
    });
  }

  private setStepCompletedIfNecessary() {
    if (this.currentComponentIndex >= this.node.components.length) {
      this.stepCompleted = true;
    }
  }

  private async startComponentTimer(): Promise<void> {
    this.saveComponentViewedEvent();
    this.timerCountDown = this.componentTimers[this.currentComponentIndex];

    this.currentInterval = setInterval(() => {
      if (--this.timerCountDown <= 0) {
        this.componentCompleted();
        clearInterval(this.currentInterval);
      }
    }, 1000);
  }

  private saveComponentViewedEvent() {
    this.studentDataService.saveEvent(
      'VLE',
      this.node.id,
      this.getCurrentComponentId(),
      null,
      'Timed',
      'componentViewed',
      {}
    );
  }

  private getCurrentComponentId(): string {
    return this.components.at(this.currentComponentIndex).id;
  }

  private getComponentSubmitArgs(componentId: string) {
    return {
      nodeId: this.node.id,
      componentId: componentId
    };
  }

  private componentCompleted(): void {
    this.saveUnsavedWork();
    this.hideComponents(++this.currentComponentIndex);
    if (this.currentComponentIndex < this.node.components.length) {
      this.startComponentTimer();
    } else {
      this.stepCompleted = true;
      this.timedNodeService.broadcastIsNodeCompleted(true);
    }
  }

  private saveUnsavedWork() {
    if (!this.isPreview()) {
      const currentComponentId = this.node.components[this.currentComponentIndex].id;
      if (this.dirtyComponentIds.includes(currentComponentId)) {
        this.studentDataService.broadcastComponentSubmitTriggered(
          this.getComponentSubmitArgs(currentComponentId)
        );
      }
    }
  }

  private hideComponents(showComponentIndex: number): void {
    this.components.forEach((component, index) => {
      this.componentToVisible[component.id] = index === showComponentIndex;
    });
  }

  protected secondsToTimerDisplay(secondsLeft: number): string {
    const minutes = '' + Math.floor(secondsLeft / 60);
    const seconds = '' + (secondsLeft % 60);
    return `${this.addZeroPadding(minutes)}${minutes}:${this.addZeroPadding(seconds)}${seconds}`;
  }

  private addZeroPadding(digits: string): string {
    const numZeros = 2 - digits.length;
    return '0'.repeat(numZeros > 0 ? numZeros : 0);
  }

  protected updateComponentVisibility(): void {
    return;
  }

  protected proceedButtonClicked(): void {
    clearInterval(this.currentInterval);
    this.componentCompleted();
  }
}
