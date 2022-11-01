import { Component, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Node } from '../../../../common/Node';
import { AnnotationService } from '../../../../services/annotationService';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { ConfigService } from '../../../../services/configService';
import { MilestoneService } from '../../../../services/milestoneService';
import { NodeInfoService } from '../../../../services/nodeInfoService';
import { NotificationService } from '../../../../services/notificationService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherPeerGroupService } from '../../../../services/teacherPeerGroupService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { UtilService } from '../../../../services/utilService';
import { Notification } from '../../../../../../app/domain/notification';
import { CompletionStatus } from '../../shared/CompletionStatus';

@Component({
  selector: 'node-grading-view',
  templateUrl: './node-grading-view.component.html',
  styleUrls: ['./node-grading-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NodeGradingViewComponent implements OnInit {
  canViewStudentNames: boolean;
  hiddenComponents: any = [];
  isExpandAll: boolean;
  maxScore: any;
  milestone: any;
  milestoneReport: any;
  node: Node;
  nodeContent: any = null;
  nodeHasWork: boolean;
  @Input() nodeId: string;
  numRubrics: number;
  peerGroupingTags: string[];
  sort: any;
  sortedWorkgroups: any[];
  subscriptions: Subscription = new Subscription();
  teacherWorkgroupId: number;
  workgroupInViewById: any = {}; // whether the workgroup is in view or not
  workgroups: any;
  workgroupsById: any = {};
  workVisibilityById: any = {}; // whether student work is visible for each workgroup

  constructor(
    protected annotationService: AnnotationService,
    protected classroomStatusService: ClassroomStatusService,
    protected configService: ConfigService,
    protected milestoneService: MilestoneService,
    protected nodeInfoService: NodeInfoService,
    protected notificationService: NotificationService,
    protected peerGroupService: TeacherPeerGroupService,
    protected projectService: TeacherProjectService,
    protected teacherDataService: TeacherDataService,
    protected utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.setupNode();
    this.subscribeToEvents();
  }

  setupNode(): void {
    this.maxScore = this.getMaxScore();
    this.node = this.projectService.getNode(this.nodeId);
    this.nodeHasWork = this.projectService.nodeHasWork(this.nodeId);
    this.sort = this.teacherDataService.nodeGradingSort;
    this.nodeContent = this.projectService.getNodeById(this.nodeId);
    this.milestoneReport = this.milestoneService.getMilestoneReportByNodeId(this.nodeId);
    this.peerGroupingTags = Array.from(this.peerGroupService.getPeerGroupingTags(this.node));
    this.retrieveStudentData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nodeId) {
      this.nodeId = changes.nodeId.currentValue;
      this.setupNode();
    }
  }

  protected subscribeToEvents(): void {
    this.subscriptions.add(
      this.projectService.projectSaved$.subscribe(() => {
        this.maxScore = this.getMaxScore();
      })
    );

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
      this.annotationService.annotationReceived$.subscribe(({ annotation }) => {
        const workgroupId = annotation.toWorkgroupId;
        if (annotation.nodeId === this.nodeId && this.workgroupsById[workgroupId]) {
          this.updateWorkgroup(workgroupId);
        }
      })
    );

    this.subscriptions.add(
      this.teacherDataService.studentWorkReceived$.subscribe(({ studentWork }) => {
        const workgroupId = studentWork.workgroupId;
        if (studentWork.nodeId === this.nodeId && this.workgroupsById[workgroupId]) {
          this.updateWorkgroup(workgroupId);
        }
      })
    );

    this.subscriptions.add(
      this.teacherDataService.currentPeriodChanged$.subscribe(() => {
        this.milestoneReport = this.milestoneService.getMilestoneReportByNodeId(this.nodeId);
      })
    );
  }

  protected retrieveStudentData(node: Node = this.node): void {
    this.teacherDataService.retrieveStudentDataForNode(node).then(() => {
      this.teacherWorkgroupId = this.configService.getWorkgroupId();
      this.workgroups = this.utilService.makeCopyOfJSONObject(
        this.configService.getClassmateUserInfos()
      );
      this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
      this.setWorkgroupsById();
      this.sortWorkgroups();
      this.numRubrics = this.projectService.getNumberOfRubricsByNodeId(node.id);
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  }

  saveNodeGradingViewDisplayedEvent() {
    const context = 'ClassroomMonitor',
      nodeId = this.nodeId,
      componentId = null,
      componentType = null,
      category = 'Navigation',
      event = 'nodeGradingViewDisplayed',
      data = { nodeId: this.nodeId };
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

  private getMaxScore(nodeId = this.nodeId): number {
    return this.projectService.getMaxScoreForNode(nodeId);
  }

  private setWorkgroupsById(): void {
    for (const workgroup of this.workgroups) {
      const workgroupId = workgroup.workgroupId;
      this.workgroupsById[workgroupId] = workgroup;
      this.workVisibilityById[workgroupId] = false;
      this.updateWorkgroup(workgroupId, true);
    }
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
    }
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

  protected createSortAscendingFunction(fieldName: string): any {
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

  protected createSortDescendingFunction(fieldName: string): any {
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
        completionStatus.latestAnnotationTime = this.getLatestAnnotationTimeByWorkgroupId(
          workgroupId
        );
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
    const componentStates = this.teacherDataService.getComponentStatesByNodeId(this.nodeId);
    for (const componentState of componentStates.reverse()) {
      if (componentState.workgroupId === workgroupId) {
        return componentState.serverSaveTime;
      }
    }
    return null;
  }

  private getLatestAnnotationTimeByWorkgroupId(workgroupId: number): string {
    const annotations = this.teacherDataService.getAnnotationsByNodeId(this.nodeId);
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

  getNodeCompletion(nodeId: string): number {
    return this.classroomStatusService.getNodeCompletion(
      nodeId,
      this.teacherDataService.getCurrentPeriodId()
    ).completionPct;
  }

  getNodeAverageScore(): any {
    const averageScore = this.classroomStatusService.getNodeAverageScore(
      this.nodeId,
      this.teacherDataService.getCurrentPeriodId()
    );
    if (averageScore === null) {
      return 'N/A';
    } else {
      return averageScore;
    }
  }

  isWorkgroupShown(workgroup: any): boolean {
    return this.teacherDataService.isWorkgroupShown(workgroup);
  }

  showRubric($event: any) {
    this.nodeInfoService.showNodeInfo(this.nodeId, $event);
  }

  setSort(value: string): void {
    if (this.sort === value) {
      this.sort = `-${value}`;
    } else {
      this.sort = value;
    }
    this.teacherDataService.nodeGradingSort = this.sort;
    this.sortWorkgroups();
  }

  expandAll(): void {
    for (const workgroup of this.workgroups) {
      const workgroupId = workgroup.workgroupId;
      if (this.workgroupInViewById[workgroupId]) {
        this.workVisibilityById[workgroupId] = true;
      }
    }
    this.isExpandAll = true;
  }

  collapseAll(): void {
    for (const workgroup of this.workgroups) {
      this.workVisibilityById[workgroup.workgroupId] = false;
    }
    this.isExpandAll = false;
  }

  onUpdateExpand({ workgroupId, value }): void {
    this.workVisibilityById[workgroupId] = value;
  }

  onUpdateHiddenComponents(value: any): void {
    this.hiddenComponents = this.utilService.makeCopyOfJSONObject(value);
  }

  onIntersection(
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

  showReport($event: any): void {
    this.milestoneService.showMilestoneDetails(this.milestoneReport, $event);
  }

  showPeerGroupDetails(peerGroupingTag: string): void {
    this.peerGroupService.showPeerGroupDetails(peerGroupingTag);
  }

  trackWorkgroup(index: number, workgroup: any) {
    return (
      `${workgroup.workgroupId}-${workgroup.completionStatus}-${workgroup.score}-` +
      `${workgroup.hasAlert}-${workgroup.hasNewAlert}-${workgroup.isVisible}`
    );
  }
}
