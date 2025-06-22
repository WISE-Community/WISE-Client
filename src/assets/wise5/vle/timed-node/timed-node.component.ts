import { Component } from '@angular/core';
import { NodeComponent } from '../node/node.component';
import { ComponentService } from '../../components/componentService';
import { ConfigService } from '../../services/configService';
import { ConstraintService } from '../../services/constraintService';
import { StudentNodeService } from '../../services/studentNodeService';
import { NodeStatusService } from '../../services/nodeStatusService';
import { VLEProjectService } from '../vleProjectService';
import { SessionService } from '../../services/sessionService';
import { StudentDataService } from '../../services/studentDataService';
import { ComponentContent } from '../../common/ComponentContent';
import { CommonModule } from '@angular/common';
import { ComponentComponent } from '../../components/component/component.component';
import { ComponentStateInfoComponent } from '../../common/component-state-info/component-state-info.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HelpIconComponent } from '../../themes/default/themeComponents/helpIcon/help-icon.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { SubmitSurveyComponent } from '../submit-survey/submit-survey.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'timed-node',
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
  templateUrl: './timed-node.component.html',
  styleUrl: './timed-node.component.scss'
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
    protected studentDataService: StudentDataService
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
    await this.skipComponentsWithWork();
    if (!this.stepCompleted) {
      this.componentTimers = this.node.components.map((component: ComponentContent) => {
        return component.timeLimit ?? -1;
      });
      this.components.forEach((component, index) => {
        this.componentToVisible[component.id] = index === this.currentComponentIndex;
      });
      this.startComponentTimer();
    }
  }

  private async skipComponentsWithWork() {
    const studentWork = await this.studentDataService.retrieveStudentDataForSignedInStudent();
    const componentsWithWork = studentWork.componentStates.map(
      (componentState) => componentState.componentId
    );
    this.node.components.forEach((component, componentIndex) => {
      if (
        componentsWithWork.includes(component.id) &&
        componentIndex >= this.currentComponentIndex
      ) {
        this.currentComponentIndex = componentIndex + 1;
      }
    });
    if (this.currentComponentIndex >= this.node.components.length) {
      this.stepCompleted = true;
    }
  }

  private startComponentTimer(): void {
    this.timerCountDown = this.componentTimers[this.currentComponentIndex];

    this.currentInterval = setInterval(() => {
      if (--this.timerCountDown === 0) {
        this.componentCompleted();
        clearInterval(this.currentInterval);
      }
    }, 1000);
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
    }
  }

  private saveUnsavedWork() {
    const currentComponentId = this.node.components[this.currentComponentIndex].id;
    if (this.dirtyComponentIds.includes(currentComponentId)) {
      this.studentDataService.broadcastComponentSubmitTriggered(
        this.getComponentSubmitArgs(currentComponentId)
      );
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
