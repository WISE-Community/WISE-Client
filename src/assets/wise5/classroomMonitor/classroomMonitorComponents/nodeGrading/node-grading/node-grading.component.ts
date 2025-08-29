import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ShowNodeInfoDialogComponent } from '../../../../../../app/classroom-monitor/show-node-info-dialog/show-node-info-dialog.component';
import { Node } from '../../../../common/Node';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { FilterComponentsComponent } from '../filter-components/filter-components.component';
import { ComponentContent } from '../../../../common/ComponentContent';
import { NodeClassResponsesComponent } from '../node-class-responses/node-class-responses.component';

@Component({
  imports: [
    CommonModule,
    FilterComponentsComponent,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    NodeClassResponsesComponent
  ],
  styles: [
    `
      .content-head-label {
        font-size: 50%;
      }

      .component-select {
        padding: 6px 16px;
      }

      .list-item {
        display: block;
      }

      .mat-body-1 {
        margin: 0;
      }
    `
  ],
  templateUrl: './node-grading.component.html'
})
export class NodeGradingComponent {
  protected components: ComponentContent[];
  protected hasWork: boolean;
  protected node: Node;
  protected nodeAverageScore: number;
  protected nodeCompletionPercent: number;
  protected nodeMaxScore: number;
  @Input() nodeId: string;
  protected numRubrics: number;
  private periodId: number;
  private subscriptions: Subscription = new Subscription();
  protected visibleComponents: ComponentContent[];

  constructor(
    private classroomStatusService: ClassroomStatusService,
    private dataService: TeacherDataService,
    private dialog: MatDialog,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.setFields();
    this.subscriptions.add(
      this.dataService.currentPeriodChanged$.subscribe(() => this.setPeriod())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges(): void {
    this.setFields();
  }

  private setFields(): void {
    this.hasWork = this.projectService.nodeHasWork(this.nodeId);
    this.node = this.projectService.getNode(this.nodeId);
    this.nodeAverageScore = this.classroomStatusService.getNodeAverageScore(
      this.nodeId,
      this.dataService.getCurrentPeriodId()
    );
    this.nodeCompletionPercent = this.classroomStatusService.getNodeCompletion(
      this.nodeId,
      this.dataService.getCurrentPeriodId()
    ).completionPct;
    this.nodeMaxScore = this.projectService.getMaxScoreForNode(this.nodeId);
    this.components = this.projectService
      .getComponents(this.nodeId)
      .filter((component) => this.projectService.componentHasWork(component))
      .map((component, index) => {
        component['displayIndex'] = index + 1;
        return component;
      });
    this.visibleComponents = this.components;
    this.numRubrics = this.node.getNumRubrics();
    this.setPeriod();
  }

  private setPeriod(): void {
    this.periodId = this.dataService.getCurrentPeriodId();
    this.setNodeAverageScore();
    this.setNodeCompletionPercent();
  }

  private setNodeAverageScore(): void {
    this.nodeAverageScore = this.classroomStatusService.getNodeAverageScore(
      this.nodeId,
      this.periodId
    );
  }

  private setNodeCompletionPercent(): void {
    this.nodeCompletionPercent = this.classroomStatusService.getNodeCompletion(
      this.nodeId,
      this.periodId
    ).completionPct;
  }

  protected setVisibleComponents(visibleComponents: ComponentContent[]): void {
    this.visibleComponents = visibleComponents;
  }

  protected showRubric(): void {
    this.dialog.open(ShowNodeInfoDialogComponent, {
      data: this.nodeId,
      width: '90%'
    });
  }
}
