import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { copy } from '../../../../common/object/object';
import { AnnotationService } from '../../../../services/annotationService';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { ConfigService } from '../../../../services/configService';
import { MilestoneService } from '../../../../services/milestoneService';
import { NotificationService } from '../../../../services/notificationService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherPeerGroupService } from '../../../../services/teacherPeerGroupService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { NodeGradingViewComponent } from '../../nodeGrading/node-grading-view/node-grading-view.component';
import { Annotation } from '../../../../common/Annotation';

@Component({
  selector: 'milestone-grading-view',
  templateUrl: './milestone-grading-view.component.html',
  styleUrls: ['./milestone-grading-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MilestoneGradingViewComponent extends NodeGradingViewComponent {
  componentId: string;
  firstNodeId: string;
  firstNodePosition: string;
  lastNodeId: string;
  lastNodePosition: string;
  @Input() milestone: any;
  node: any;
  nodeId: string;

  constructor(
    protected annotationService: AnnotationService,
    protected classroomStatusService: ClassroomStatusService,
    protected configService: ConfigService,
    protected dialog: MatDialog,
    protected milestoneService: MilestoneService,
    protected notificationService: NotificationService,
    protected peerGroupService: TeacherPeerGroupService,
    protected projectService: TeacherProjectService,
    protected teacherDataService: TeacherDataService
  ) {
    super(
      annotationService,
      classroomStatusService,
      configService,
      dialog,
      milestoneService,
      notificationService,
      peerGroupService,
      projectService,
      teacherDataService
    );
  }

  ngOnInit(): void {
    this.nodeId = this.milestone.nodeId;
    this.node = this.projectService.getNode(this.nodeId);
    if (this.milestone.report.locations.length > 1) {
      this.firstNodeId = this.milestone.report.locations[0].nodeId;
      this.lastNodeId = this.milestone.report.locations[
        this.milestone.report.locations.length - 1
      ].nodeId;
    }
    this.componentId = this.milestone.componentId;
    this.retrieveStudentData();
    this.subscribeToEvents();
    this.getNodePositions();
  }

  protected subscribeToEvents(): void {
    super.subscribeToEvents();
    if (this.milestone.report.locations.length > 1) {
      this.subscriptions.add(
        this.annotationService.annotationReceived$.subscribe((annotation: Annotation) => {
          const workgroupId = annotation.toWorkgroupId;
          if (annotation.nodeId === this.firstNodeId && this.workgroupsById[workgroupId]) {
            this.updateWorkgroup(workgroupId);
          }
        })
      );
    }
  }

  protected retrieveStudentData(): void {
    const firstNode = this.projectService.getNode(this.firstNodeId);
    super.retrieveStudentData(firstNode);
    if (this.milestone.report.locations.length > 1) {
      const lastNode = this.projectService.getNode(this.lastNodeId);
      super.retrieveStudentData(lastNode);
    }
  }

  private getNodePositions(): void {
    if (this.milestone.report.locations.length > 1) {
      this.firstNodePosition = this.projectService.getNodePositionById(this.firstNodeId);
      this.lastNodePosition = this.projectService.getNodePositionById(this.lastNodeId);
    }
  }

  private getScoreByWorkgroupId(
    workgroupId: number,
    nodeId: string = this.nodeId,
    componentId: string = this.componentId
  ): number {
    let score = null;
    const latestScoreAnnotation = this.annotationService.getLatestScoreAnnotation(
      nodeId,
      componentId,
      workgroupId
    );
    if (latestScoreAnnotation) {
      score = this.annotationService.getScoreValueFromScoreAnnotation(latestScoreAnnotation);
    }
    return score;
  }

  expandAll(): void {
    super.expandAll();
    this.saveMilestoneStudentWorkExpandCollapseAllEvent('MilestoneStudentWorkExpandAllClicked');
  }

  collapseAll(): void {
    super.collapseAll();
    this.saveMilestoneStudentWorkExpandCollapseAllEvent('MilestoneStudentWorkCollapseAllClicked');
  }

  private saveMilestoneStudentWorkExpandCollapseAllEvent(event: any): void {
    const context = 'ClassroomMonitor',
      nodeId = null,
      componentId = null,
      componentType = null,
      category = 'Navigation',
      data = { milestoneId: this.milestone.id };
    this.teacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      event,
      data
    );
  }

  onUpdateExpand({ workgroupId, value }): void {
    super.onUpdateExpand({ workgroupId: workgroupId, value: value });
    this.saveMilestoneWorkgroupItemViewedEvent(workgroupId, value);
  }

  protected updateWorkgroup(workgroupId: number): void {
    super.updateWorkgroup(workgroupId);
    const workgroup = this.workgroupsById[workgroupId];
    workgroup.score = this.getScoreByWorkgroupId(workgroupId);
    if (this.milestone.report.locations.length > 1) {
      const firstLocation = this.milestone.report.locations[0];
      workgroup.initialScore = this.getScoreByWorkgroupId(
        workgroupId,
        firstLocation.nodeId,
        firstLocation.componentId
      );
      workgroup.changeInScore = this.getChangeInScore(workgroup.initialScore, workgroup.score);
    }
    this.workgroupsById[workgroupId] = copy(workgroup);
  }

  private getChangeInScore(initialScore: number, revisedScore: number): number {
    if (initialScore != -1 && revisedScore != -1) {
      return revisedScore - initialScore;
    }
    return -10000; // this hack ensures that this score appears as the lowest score
  }

  private saveMilestoneWorkgroupItemViewedEvent(workgroupId: number, isExpanded: boolean): void {
    let event = '';
    if (isExpanded) {
      event = 'MilestoneStudentWorkOpened';
    } else {
      event = 'MilestoneStudentWorkClosed';
    }
    const context = 'ClassroomMonitor',
      nodeId = null,
      componentId = null,
      componentType = null,
      category = 'Navigation',
      data = { milestoneId: this.milestone.id, workgroupId: workgroupId };
    this.teacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      event,
      data
    );
  }

  protected sortWorkgroups(): void {
    super.sortWorkgroups();
    switch (this.sort) {
      case 'initialScore':
        this.sortedWorkgroups.sort(this.createSortAscendingFunction('initialScore'));
        break;
      case '-initialScore':
        this.sortedWorkgroups.sort(this.createSortDescendingFunction('initialScore'));
        break;
      case 'changeInScore':
        this.sortedWorkgroups.sort(this.createSortAscendingFunction('changeInScore'));
        break;
      case '-changeInScore':
        this.sortedWorkgroups.sort(this.createSortDescendingFunction('changeInScore'));
        break;
    }
  }
}
