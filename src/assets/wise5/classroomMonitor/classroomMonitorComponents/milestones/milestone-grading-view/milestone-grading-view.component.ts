import { Component, Input, ViewEncapsulation } from '@angular/core';
import { copy } from '../../../../common/object/object';
import { Annotation } from '../../../../common/Annotation';
import { CompletionStatus } from '../../shared/CompletionStatus';
import { Subscription } from 'rxjs';
import { AbstractClassResponsesComponent } from '../../AbstractClassResponseComponent';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'milestone-grading-view',
  standalone: false,
  styleUrl: './milestone-grading-view.component.scss',
  templateUrl: './milestone-grading-view.component.html'
})
export class MilestoneGradingViewComponent extends AbstractClassResponsesComponent {
  private componentId: string;
  private firstNodeId: string;
  protected firstNodePosition: string;
  private lastNodeId: string;
  protected lastNodePosition: string;
  @Input() milestone: any;
  private nodeId: string;
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.nodeId = this.milestone.nodeId;
    if (this.milestone.report.locations.length > 1) {
      this.firstNodeId = this.milestone.report.locations[0].nodeId;
      this.lastNodeId =
        this.milestone.report.locations[this.milestone.report.locations.length - 1].nodeId;
    }
    this.componentId = this.milestone.componentId;
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
        if (annotation.nodeId === this.nodeId && this.workgroupsById[workgroupId]) {
          this.updateWorkgroup(workgroupId);
        }
      })
    );

    this.subscriptions.add(
      this.dataService.studentWorkReceived$.subscribe(({ studentWork }) => {
        const workgroupId = studentWork.workgroupId;
        if (studentWork.nodeId === this.nodeId && this.workgroupsById[workgroupId]) {
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
      const nodeStatus = studentStatus.nodeStatuses[this.nodeId];
      if (nodeStatus) {
        completionStatus.isVisible = nodeStatus.isVisible;
        completionStatus.latestWorkTime = this.getLatestWorkTimeByWorkgroupId(workgroupId);
        completionStatus.latestAnnotationTime =
          this.getLatestAnnotationTimeByWorkgroupId(workgroupId);
        if (!this.projectService.nodeHasWork(this.nodeId)) {
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
    const componentStates = this.dataService.getComponentStatesByNodeId(this.nodeId);
    for (const componentState of componentStates.reverse()) {
      if (componentState.workgroupId === workgroupId) {
        return componentState.serverSaveTime;
      }
    }
    return null;
  }

  private getLatestAnnotationTimeByWorkgroupId(workgroupId: number): string {
    const annotations = this.dataService.getAnnotationsByNodeId(this.nodeId);
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

  protected expandAll(): void {
    for (const workgroup of this.workgroups) {
      const workgroupId = workgroup.workgroupId;
      if (this.workgroupInViewById[workgroupId]) {
        this.workVisibilityById[workgroupId] = true;
      }
    }
    this.isExpandAll = true;
    this.saveMilestoneStudentWorkExpandCollapseAllEvent('MilestoneStudentWorkExpandAllClicked');
  }

  protected collapseAll(): void {
    for (const workgroup of this.workgroups) {
      this.workVisibilityById[workgroup.workgroupId] = false;
    }
    this.isExpandAll = false;
    this.saveMilestoneStudentWorkExpandCollapseAllEvent('MilestoneStudentWorkCollapseAllClicked');
  }

  private saveMilestoneStudentWorkExpandCollapseAllEvent(event: any): void {
    const context = 'ClassroomMonitor',
      nodeId = null,
      componentId = null,
      componentType = null,
      category = 'Navigation',
      data = { milestoneId: this.milestone.id };
    this.dataService.saveEvent(context, nodeId, componentId, componentType, category, event, data);
  }

  protected isWorkgroupShown(workgroup: any): boolean {
    return this.dataService.isWorkgroupShown(workgroup);
  }

  protected onUpdateExpand({ workgroupId, value }): void {
    this.workVisibilityById[workgroupId] = value;
    this.saveMilestoneWorkgroupItemViewedEvent(workgroupId, value);
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
      nodeId: this.nodeId,
      toWorkgroupId: workgroupId
    });
    workgroup.hasAlert = alertNotifications.length > 0;
    workgroup.hasNewAlert = alertNotifications.some((alert) => !alert.timeDismissed);
    const completionStatus = this.getCompletionStatusByWorkgroupId(workgroupId);
    workgroup.isVisible = completionStatus.isVisible ? 1 : 0;
    workgroup.completionStatus = this.getWorkgroupCompletionStatus(completionStatus);
    workgroup.score = this.annotationService.getTotalNodeScoreForWorkgroup(
      workgroupId,
      this.nodeId
    );
    const studentStatus = this.classroomStatusService.getStudentStatusForWorkgroupId(workgroupId);
    workgroup.nodeStatus = studentStatus.nodeStatuses[this.nodeId] || {};
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
    this.dataService.saveEvent(context, nodeId, componentId, componentType, category, event, data);
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
