import { Component, Input, ViewEncapsulation } from '@angular/core';
import { copy } from '../../../../common/object/object';
import { Annotation } from '../../../../common/Annotation';
import { CompletionStatus } from '../../shared/CompletionStatus';
import { Subscription } from 'rxjs';
import { AbstractClassResponsesComponent } from '../../AbstractClassResponseComponent';
import { Node } from '../../../../common/Node';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'milestone-grading-view',
  standalone: false,
  styleUrl: './milestone-grading-view.component.scss',
  templateUrl: './milestone-grading-view.component.html'
})
export class MilestoneGradingViewComponent extends AbstractClassResponsesComponent {
  protected component: any;
  private firstNodeId: string;
  protected firstNodePosition: string;
  private lastNodeId: string;
  protected lastNodePosition: string;
  @Input() milestone: any;
  protected node: Node;
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.node = this.projectService.getNode(this.milestone.nodeId);
    this.component = this.node.getComponent(this.milestone.componentId);
    if (this.milestone.report.locations.length > 1) {
      this.firstNodeId = this.milestone.report.locations[0].nodeId;
      this.lastNodeId =
        this.milestone.report.locations[this.milestone.report.locations.length - 1].nodeId;
    }
    this.retrieveStudentData(this.projectService.getNode(this.firstNodeId));
    if (this.milestone.report.locations.length > 1) {
      this.retrieveStudentData(this.projectService.getNode(this.lastNodeId));
    }
    this.subscribeToEvents();
    this.getNodePositions();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected subscribeToEvents(): void {
    this.subscriptions.add(
      this.notificationService.notificationChanged$.subscribe((notification) => {
        if (notification.type === 'CRaterResult') {
          // TODO: expand to encompass other notification types that should be shown to teacher
          const workgroupId = notification.toWorkgroupId;
          if (this.workgroupsById[workgroupId]) {
            this.updateWorkgroup(workgroupId);
          }
        }
      })
    );

    this.subscriptions.add(
      this.annotationService.annotationReceived$.subscribe((annotation: Annotation) => {
        const workgroupId = annotation.toWorkgroupId;
        if (annotation.nodeId === this.node.id && this.workgroupsById[workgroupId]) {
          this.updateWorkgroup(workgroupId);
        }
      })
    );

    this.subscriptions.add(
      this.dataService.studentWorkReceived$.subscribe(({ studentWork }) => {
        const workgroupId = studentWork.workgroupId;
        if (studentWork.nodeId === this.node.id && this.workgroupsById[workgroupId]) {
          this.updateWorkgroup(workgroupId);
        }
      })
    );
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

  private getCompletionStatusByWorkgroupId(workgroupId: number): CompletionStatus {
    const completionStatus: CompletionStatus = {
      isCompleted: false,
      isVisible: false,
      latestWorkTime: null,
      latestAnnotationTime: null
    };
    const studentStatus = this.classroomStatusService.getStudentStatusForWorkgroupId(workgroupId);
    if (studentStatus != null) {
      const nodeStatus = studentStatus.nodeStatuses[this.node.id];
      if (nodeStatus) {
        completionStatus.isVisible = nodeStatus.isVisible;
        completionStatus.latestWorkTime = this.getLatestWorkTimeByWorkgroupId(workgroupId);
        completionStatus.latestAnnotationTime =
          this.getLatestAnnotationTimeByWorkgroupId(workgroupId);
        if (!this.projectService.nodeHasWork(this.node.id)) {
          completionStatus.isCompleted = nodeStatus.isVisited;
        }
        if (completionStatus.latestWorkTime) {
          completionStatus.isCompleted = nodeStatus.isCompleted;
        }
      }
    }
    return completionStatus;
  }

  private getLatestWorkTimeByWorkgroupId(workgroupId: number): string {
    const componentStates = this.dataService.getComponentStatesByNodeId(this.node.id);
    for (const componentState of componentStates.reverse()) {
      if (componentState.workgroupId === workgroupId) {
        return componentState.serverSaveTime;
      }
    }
    return null;
  }

  private getLatestAnnotationTimeByWorkgroupId(workgroupId: number): string {
    const annotations = this.dataService.getAnnotationsByNodeId(this.node.id);
    for (const annotation of annotations.reverse()) {
      // TODO: support checking for annotations from shared teachers
      if (
        annotation.toWorkgroupId === workgroupId &&
        annotation.fromWorkgroupId === this.configService.getWorkgroupId()
      ) {
        return annotation.serverSaveTime;
      }
    }
    return null;
  }

  private getNodePositions(): void {
    if (this.milestone.report.locations.length > 1) {
      this.firstNodePosition = this.projectService.getNodePositionById(this.firstNodeId);
      this.lastNodePosition = this.projectService.getNodePositionById(this.lastNodeId);
    }
  }

  private getScoreByWorkgroupId(
    workgroupId: number,
    nodeId: string = this.node.id,
    componentId: string = this.component.id
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

  protected expandAll(): void {
    super.expandAll();
    this.saveMilestoneStudentWorkExpandCollapseAllEvent('MilestoneStudentWorkExpandAllClicked');
  }

  protected collapseAll(): void {
    super.collapseAll();
    this.saveMilestoneStudentWorkExpandCollapseAllEvent('MilestoneStudentWorkCollapseAllClicked');
  }

  private saveMilestoneStudentWorkExpandCollapseAllEvent(event: any): void {
    this.dataService.saveEvent('ClassroomMonitor', null, null, null, 'Navigation', event, {
      milestoneId: this.milestone.id
    });
  }

  protected onUpdateExpand({ workgroupId, value }): void {
    super.onUpdateExpand({ workgroupId, value });
    this.saveMilestoneWorkgroupItemViewedEvent(workgroupId, value);
  }

  private saveMilestoneWorkgroupItemViewedEvent(workgroupId: number, isExpanded: boolean): void {
    const event = isExpanded ? 'MilestoneStudentWorkOpened' : 'MilestoneStudentWorkClosed';
    this.dataService.saveEvent('ClassroomMonitor', null, null, null, 'Navigation', event, {
      milestoneId: this.milestone.id,
      workgroupId: workgroupId
    });
  }

  /**
   * Update statuses, scores, notifications, etc. for a workgroup object. Also check if we need to
   * hide student names because logged-in user does not have the right permissions
   * @param workgroupID a workgroup ID number
   * @param init Boolean whether we're in controller initialization or not
   */
  protected updateWorkgroup(workgroupId: number, init = false): void {
    const workgroup = this.workgroupsById[workgroupId];
    const alertNotifications = this.notificationService.getAlertNotifications({
      nodeId: this.node.id,
      toWorkgroupId: workgroupId
    });
    workgroup.hasAlert = alertNotifications.length > 0;
    workgroup.hasNewAlert = alertNotifications.some((alert) => !alert.timeDismissed);
    const completionStatus = this.getCompletionStatusByWorkgroupId(workgroupId);
    workgroup.isVisible = completionStatus.isVisible ? 1 : 0;
    workgroup.completionStatus = this.getWorkgroupCompletionStatus(completionStatus);
    workgroup.score = this.annotationService.getTotalNodeScoreForWorkgroup(
      workgroupId,
      this.node.id
    );
    const studentStatus = this.classroomStatusService.getStudentStatusForWorkgroupId(workgroupId);
    workgroup.nodeStatus = studentStatus.nodeStatuses[this.node.id] || {};
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
    if (!init) {
      this.workgroupsById[workgroupId] = copy(workgroup);
    }
  }

  private getChangeInScore(initialScore: number, revisedScore: number): number {
    if (initialScore != -1 && revisedScore != -1) {
      return revisedScore - initialScore;
    }
    return -10000; // this hack ensures that this score appears as the lowest score
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
