import { Component, Input, ViewEncapsulation } from '@angular/core';
import { copy } from '../../../../common/object/object';
import { Annotation } from '../../../../common/Annotation';
import { Node } from '../../../../common/Node';
import { CompletionStatus } from '../../shared/CompletionStatus';
import { Notification } from '../../../../../../app/domain/notification';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AnnotationService } from '../../../../services/annotationService';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { ConfigService } from '../../../../services/configService';
import { NotificationService } from '../../../../services/notificationService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

@Component({
  selector: 'milestone-grading-view',
  templateUrl: './milestone-grading-view.component.html',
  styleUrls: ['./milestone-grading-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MilestoneGradingViewComponent {
  private componentId: string;
  private firstNodeId: string;
  protected firstNodePosition: string;
  protected isExpandAll: boolean;
  private lastNodeId: string;
  protected lastNodePosition: string;
  @Input() milestone: any;
  private nodeId: string;
  protected sort: string;
  sortedWorkgroups: any[];
  private subscriptions: Subscription = new Subscription();
  private workgroupInViewById: any = {}; // whether the workgroup is in view or not
  workgroups: any;
  private workgroupsById: any = {};
  private workVisibilityById: any = {}; // whether student work is visible for each workgroup

  constructor(
    protected annotationService: AnnotationService,
    protected classroomStatusService: ClassroomStatusService,
    protected configService: ConfigService,
    protected dataService: TeacherDataService,
    protected dialog: MatDialog,
    protected notificationService: NotificationService,
    protected projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.nodeId = this.milestone.nodeId;
    if (this.milestone.report.locations.length > 1) {
      this.firstNodeId = this.milestone.report.locations[0].nodeId;
      this.lastNodeId =
        this.milestone.report.locations[this.milestone.report.locations.length - 1].nodeId;
    }
    this.componentId = this.milestone.componentId;
    this.retrieveStudentData();
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

  private workgroupHasNewAlert(alertNotifications: Notification[]): boolean {
    for (const alert of alertNotifications) {
      if (!alert.timeDismissed) {
        return true;
      }
    }
    return false;
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
        // TODO: store this info in the nodeStatus so we don't have to calculate every time?
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

  /**
   * Returns a numerical status value for a given completion status object depending on node
   * completion
   * Available status values are: 0 (not visited/no work; default), 1 (partially completed),
   * 2 (completed)
   * @param completionStatus Object
   * @returns Integer status value
   */
  private getWorkgroupCompletionStatus(completionStatus: CompletionStatus): number {
    // TODO: store this info in the nodeStatus so we don't have to calculate every time (and can use
    // more widely)?
    let status = 0;
    if (!completionStatus.isVisible) {
      status = -1;
    } else if (completionStatus.isCompleted) {
      status = 2;
    } else if (completionStatus.latestWorkTime !== null) {
      status = 1;
    }
    return status;
  }

  protected retrieveStudentData(): void {
    this.retrieveStudentDataForNode(this.projectService.getNode(this.firstNodeId));
    if (this.milestone.report.locations.length > 1) {
      this.retrieveStudentDataForNode(this.projectService.getNode(this.lastNodeId));
    }
  }

  private retrieveStudentDataForNode(node: Node): void {
    this.dataService.retrieveStudentDataForNode(node).subscribe(() => {
      this.workgroups = copy(this.configService.getClassmateUserInfos()).filter(
        (workgroup) =>
          workgroup.workgroupId != null &&
          this.classroomStatusService.hasStudentStatus(workgroup.workgroupId)
      );
      this.setWorkgroupsById();
      this.sortWorkgroups();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  }

  private setWorkgroupsById(): void {
    for (const workgroup of this.workgroups) {
      const workgroupId = workgroup.workgroupId;
      this.workgroupsById[workgroupId] = workgroup;
      this.workVisibilityById[workgroupId] = false;
      this.updateWorkgroup(workgroupId, true);
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
    workgroup.hasNewAlert = this.workgroupHasNewAlert(alertNotifications);
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

  setSort(value: string): void {
    if (this.sort === value) {
      this.sort = `-${value}`;
    } else {
      this.sort = value;
    }
    this.dataService.nodeGradingSort = this.sort;
    this.sortWorkgroups();
  }

  protected sortWorkgroups(): void {
    this.sortedWorkgroups = [];
    for (const workgroup of this.workgroups) {
      this.sortedWorkgroups.push(workgroup);
    }
    switch (this.sort) {
      case 'team':
        this.sortedWorkgroups.sort(this.sortTeamAscending);
        break;
      case '-team':
        this.sortedWorkgroups.sort(this.sortTeamDescending);
        break;
      case 'status':
        this.sortedWorkgroups.sort(this.createSortAscendingFunction('completionStatus'));
        break;
      case '-status':
        this.sortedWorkgroups.sort(this.createSortDescendingFunction('completionStatus'));
        break;
      case 'score':
        this.sortedWorkgroups.sort(this.createSortAscendingFunction('score'));
        break;
      case '-score':
        this.sortedWorkgroups.sort(this.createSortDescendingFunction('score'));
        break;
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

  private createSortDescendingFunction(fieldName: string): any {
    return (workgroupA: any, workgroupB: any) => {
      if (workgroupA.isVisible === workgroupB.isVisible) {
        if (workgroupA[fieldName] === workgroupB[fieldName]) {
          return workgroupA.workgroupId - workgroupB.workgroupId;
        } else {
          return workgroupB[fieldName] - workgroupA[fieldName];
        }
      } else {
        return workgroupB.isVisible - workgroupA.isVisible;
      }
    };
  }

  private createSortAscendingFunction(fieldName: string): any {
    return (workgroupA: any, workgroupB: any) => {
      if (workgroupA.isVisible === workgroupB.isVisible) {
        if (workgroupA[fieldName] === workgroupB[fieldName]) {
          return workgroupA.workgroupId - workgroupB.workgroupId;
        } else {
          return workgroupA[fieldName] - workgroupB[fieldName];
        }
      } else {
        return workgroupB.isVisible - workgroupA.isVisible;
      }
    };
  }

  /**
   * Sort using this order hierarchy
   * isVisible descending, workgroupId ascending
   */
  private sortTeamAscending(workgroupA: any, workgroupB: any): number {
    if (workgroupA.isVisible === workgroupB.isVisible) {
      return workgroupA.workgroupId - workgroupB.workgroupId;
    } else {
      return workgroupB.isVisible - workgroupA.isVisible;
    }
  }

  /**
   * Sort using this order hierarchy
   * isVisible descending, workgroupId descending
   */
  private sortTeamDescending(workgroupA: any, workgroupB: any): number {
    if (workgroupA.isVisible === workgroupB.isVisible) {
      return workgroupB.workgroupId - workgroupA.workgroupId;
    } else {
      return workgroupB.isVisible - workgroupA.isVisible;
    }
  }

  protected onIntersection(
    workgroupId: number,
    intersectionObserverEntries: IntersectionObserverEntry[]
  ): void {
    for (const entry of intersectionObserverEntries) {
      this.workgroupInViewById[workgroupId] = entry.isIntersecting;
      if (this.isExpandAll && entry.isIntersecting) {
        this.workVisibilityById[workgroupId] = true;
      }
    }
  }
}
