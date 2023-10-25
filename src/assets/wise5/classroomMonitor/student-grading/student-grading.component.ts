import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { copy } from '../../common/object/object';
import { AnnotationService } from '../../services/annotationService';
import { ClassroomStatusService } from '../../services/classroomStatusService';
import { ConfigService } from '../../services/configService';
import { NotificationService } from '../../services/notificationService';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { ActivatedRoute } from '@angular/router';
import { Annotation } from '../../common/Annotation';

@Component({
  selector: 'student-grading',
  templateUrl: './student-grading.component.html',
  styleUrls: ['./student-grading.component.scss']
})
export class StudentGradingComponent implements OnInit {
  isExpandAll: boolean;
  maxScore: any;
  nodeId: string;
  nodeIds: any;
  nodesById: any = {}; // object that will hold node names, statuses, scores, notifications, etc.
  nodesInViewById: any = {}; // object that holds whether the node is in view or not
  nodeVisibilityById: any = {}; // object that specifies whether student work is visible for node
  permissions: any;
  projectCompletion: any;
  showNonWorkNodes: any = false;
  sort: any;
  sortedNodes: any[];
  subscriptions: Subscription = new Subscription();
  totalScore: number;
  @Input() workgroupId: number;

  constructor(
    private annotationService: AnnotationService,
    private classroomStatusService: ClassroomStatusService,
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private notificationService: NotificationService,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscribeToProjectSaved();
    this.subscribeToNotificationChanged();
    this.subscribeToAnnotationReceived();
    this.subscribeToStudentWorkReceived();
    this.subscribeToCurrentWorkgroupChanged();
    this.subscribeToCurrentPeriodChanged();
    this.workgroupId = parseInt(this.route.snapshot.params['workgroupId']);
    this.initialize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.workgroupId && !changes.workgroupId.isFirstChange()) {
      this.initialize();
    }
  }

  private initialize(): void {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.sort = this.dataService.studentGradingSort;
    this.dataService.nodeGradingSort = this.sort;
    this.permissions = this.configService.getPermissions();
    const workgroup = this.configService.getUserInfoByWorkgroupId(this.workgroupId);
    this.dataService.setCurrentWorkgroup(workgroup);
    let maxScore = this.classroomStatusService.getMaxScoreForWorkgroupId(this.workgroupId);
    this.maxScore = maxScore ? maxScore : 0;
    this.totalScore = this.dataService.getTotalScoreByWorkgroupId(this.workgroupId);
    this.projectCompletion = this.classroomStatusService.getStudentProjectCompletion(
      this.workgroupId,
      true
    );
    this.nodeIds = this.projectService.getFlattenedProjectAsNodeIds();
    this.setNodesById();
    this.sortedNodes = Object.values(this.nodesById);
    this.sortNodes();
    this.collapseAll();
    document.querySelector('.view-content').scrollIntoView();
  }

  private subscribeToProjectSaved(): void {
    this.subscriptions.add(
      this.projectService.projectSaved$.subscribe(() => {
        this.maxScore = this.classroomStatusService.getMaxScoreForWorkgroupId(this.workgroupId);
        this.setNodesById();
      })
    );
  }

  private subscribeToNotificationChanged(): void {
    this.notificationService.notificationChanged$.subscribe((notification) => {
      if (notification.type === 'CRaterResult') {
        // TODO: expand to encompass other notification types that should be shown to teacher
        let workgroupId = notification.toWorkgroupId;
        let nodeId = notification.nodeId;
        if (workgroupId === this.workgroupId && this.nodesById[nodeId]) {
          this.updateNode(nodeId);
        }
      }
    });
  }

  private subscribeToAnnotationReceived(): void {
    this.subscriptions.add(
      this.annotationService.annotationReceived$.subscribe((annotation: Annotation) => {
        const workgroupId = annotation.toWorkgroupId;
        const nodeId = annotation.nodeId;
        if (workgroupId === this.workgroupId && this.nodesById[nodeId]) {
          this.totalScore = this.dataService.getTotalScoreByWorkgroupId(workgroupId);
          this.updateNode(nodeId);
        }
      })
    );
  }

  private subscribeToStudentWorkReceived(): void {
    this.subscriptions.add(
      this.dataService.studentWorkReceived$.subscribe((args: any) => {
        const studentWork = args.studentWork;
        if (studentWork != null) {
          let workgroupId = studentWork.workgroupId;
          let nodeId = studentWork.nodeId;
          if (workgroupId === this.workgroupId && this.nodesById[nodeId]) {
            this.updateNode(nodeId);
          }
        }
      })
    );
  }

  private subscribeToCurrentWorkgroupChanged(): void {
    this.subscriptions.add(
      this.dataService.currentWorkgroupChanged$
        .pipe(filter(({ currentWorkgroup }) => currentWorkgroup != null))
        .subscribe(({ currentWorkgroup }) => {
          const workgroupId = currentWorkgroup.workgroupId;
          if (this.workgroupId !== workgroupId) {
            this.workgroupId = workgroupId;
            this.initialize();
          }
        })
    );
  }

  private subscribeToCurrentPeriodChanged(): void {
    this.subscriptions.add(
      this.dataService.currentPeriodChanged$.subscribe(({ currentPeriod }) => {
        let periodId = currentPeriod.periodId;
        let currentWorkgroup = this.dataService.getCurrentWorkgroup();
        if (!currentWorkgroup) {
          let workgroups = copy(this.configService.getClassmateUserInfos());
          let n = workgroups.length;
          for (let i = 0; i < n; i++) {
            let workgroup = workgroups[i];
            if (workgroup.periodId === periodId) {
              this.dataService.setCurrentWorkgroup(workgroup);
              break;
            }
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.dataService.setCurrentWorkgroup(null);
    this.subscriptions.unsubscribe();
  }

  /**
   * Build the nodesById object; don't include group nodes
   */
  private setNodesById(): void {
    this.nodesById = {};
    for (let i = 0; i < this.nodeIds.length; i++) {
      const id = this.nodeIds[i];
      if (this.projectService.isApplicationNode(id)) {
        let node = copy(this.projectService.getNodeById(id));
        this.nodesById[id] = node;
        this.updateNode(id);
      }
    }
  }

  /**
   * Update statuses, scores, notifications, etc. for a node object
   * @param nodeID a node ID number
   */
  private updateNode(nodeId: string): void {
    const node = this.nodesById[nodeId];
    if (node) {
      let alertNotifications = this.getAlertNotificationsByNodeId(nodeId);
      node.hasAlert = alertNotifications.length > 0;
      node.hasNewAlert = this.nodeHasNewAlert(alertNotifications);
      let completionStatus = this.getNodeCompletionStatusByNodeId(nodeId);
      node.hasWork = this.projectService.nodeHasWork(nodeId);
      //node.hasNewWork = completionStatus.hasNewWork;
      node.isVisible = completionStatus.isVisible ? 1 : 0;
      node.completionStatus = this.getNodeCompletionStatus(completionStatus);
      node.score = this.getNodeScoreByNodeId(nodeId);
      node.hasScore = node.score > -1;
      node.maxScore = this.projectService.getMaxScoreForNode(nodeId);
      if (node.maxScore > 0) {
        node.hasMaxScore = true;
        node.scorePct = node.score > -1 ? +(node.score / node.maxScore).toFixed(2) : 0;
      } else {
        node.hasMaxScore = false;
        node.scorePct = 0;
      }
      node.order = this.projectService.getOrderById(nodeId);
      node.show = this.isNodeShown(nodeId);
      node.nodeStatus = this.classroomStatusService.getStudentStatusForWorkgroupId(
        this.workgroupId
      )?.nodeStatuses[nodeId];
    }
  }

  private getAlertNotificationsByNodeId(nodeId: string): any[] {
    const args = {
      nodeId: nodeId,
      toWorkgroupId: this.workgroupId
    };
    return this.notificationService.getAlertNotifications(args);
  }

  private nodeHasNewAlert(alertNotifications: any[]): boolean {
    return alertNotifications.some((notification) => !notification.timeDismissed);
  }

  /**
   * Returns an object with node completion status, latest work time, and latest annotation time
   * for a workgroup for the current node
   * @param nodeId a node ID number
   * @returns Object with completion, latest work time, latest annotation time
   */
  private getNodeCompletionStatusByNodeId(nodeId: string): any {
    let isCompleted = false;
    let isVisible = false;

    // TODO: store this info in the nodeStatus so we don't have to calculate every time?
    let latestWorkTime = this.getLatestWorkTimeByNodeId(nodeId);

    let latestAnnotationTime = this.getLatestAnnotationTimeByNodeId(nodeId);
    let studentStatus = this.classroomStatusService.getStudentStatusForWorkgroupId(
      this.workgroupId
    );
    if (studentStatus != null) {
      let nodeStatus = studentStatus.nodeStatuses[nodeId];
      if (nodeStatus) {
        isVisible = nodeStatus.isVisible;
        if (latestWorkTime) {
          // workgroup has at least one componentState for this node, so check if node is completed
          isCompleted = nodeStatus.isCompleted;
        }

        if (!this.projectService.nodeHasWork(nodeId)) {
          // the step does not generate any work so completion = visited
          isCompleted = nodeStatus.isVisited;
        }
      }
    }

    return {
      isCompleted: isCompleted,
      isVisible: isVisible,
      latestWorkTime: latestWorkTime,
      latestAnnotationTime: latestAnnotationTime
    };
  }

  /**
   * Returns a numerical status value for a given completion status object depending on node
   * completion
   * Available status values are:
   * 0 (not visited/no work; default)
   * 1 (partially completed)
   * 2 (completed)
   * @param completionStatus Object
   * @returns Integer status value
   */
  private getNodeCompletionStatus(completionStatus: any): number {
    let hasWork = completionStatus.latestWorkTime !== null;
    let isCompleted = completionStatus.isCompleted;
    let isVisible = completionStatus.isVisible;

    // TODO: store this info in the nodeStatus so we don't have to calculate every time (and can use
    // more widely)?
    let status = 0; // default

    if (!isVisible) {
      status = -1;
    } else if (isCompleted) {
      status = 2;
    } else if (hasWork) {
      status = 1;
    }

    return status;
  }

  private getLatestWorkTimeByNodeId(nodeId: string): number {
    let time = null;
    const componentStates = this.dataService.getComponentStatesByNodeId(nodeId);

    // loop through component states for this node, starting with most recent
    for (let i = componentStates.length - 1; i > -1; i--) {
      let componentState = componentStates[i];
      if (componentState.workgroupId === this.workgroupId) {
        // componentState is for given workgroupId
        time = componentState.serverSaveTime;
        break;
      }
    }

    return time;
  }

  private getLatestAnnotationTimeByNodeId(nodeId: string): number {
    let time = null;
    const annotations = this.dataService.getAnnotationsByNodeId(nodeId);

    // loop through annotations for this node, starting with most recent
    for (let i = annotations.length - 1; i > -1; i--) {
      let annotation = annotations[i];
      // TODO: support checking for annotations from shared teachers
      if (
        annotation.toWorkgroupId === this.workgroupId &&
        annotation.fromWorkgroupId === this.configService.getWorkgroupId()
      ) {
        time = annotation.serverSaveTime;
        break;
      }
    }

    return time;
  }

  /**
   * Returns the score for the current workgroup for a given nodeId
   * @param nodeId a node ID number
   * @returns Number score value (defaults to -1 if node has no score)
   */
  private getNodeScoreByNodeId(nodeId: string): number {
    const score = this.annotationService.getTotalNodeScoreForWorkgroup(this.workgroupId, nodeId);
    return typeof score === 'number' ? score : -1;
  }

  /**
   * Checks whether a node should be shown
   * @param nodeId the node Id to look for
   * @returns boolean whether the workgroup should be shown
   */
  private isNodeShown(nodeId: string): boolean {
    let show = false;
    const node = this.nodesById[nodeId];

    if (node.isVisible && (this.projectService.nodeHasWork(nodeId) || this.showNonWorkNodes)) {
      let currentStep = this.dataService.getCurrentStep();
      if (currentStep) {
        // there is a currently selected step, so check if this one matches
        if (currentStep.nodeId === parseInt(nodeId)) {
          show = true;
        }
      } else {
        // there is no currently selected step, so show this one
        show = true;
      }
    }

    return show;
  }

  setSort(value: string): void {
    if (this.sort === value) {
      this.sort = `-${value}`;
    } else {
      this.sort = value;
    }

    // update value in the teacher data service so we can persist across view instances and
    // workgroup changes
    this.dataService.studentGradingSort = this.sort;
    this.sortNodes();
  }

  private sortNodes(): void {
    switch (this.sort) {
      case 'step':
        this.sortedNodes.sort(this.sortStepAscending);
        break;
      case '-step':
        this.sortedNodes.sort(this.sortStepDescending);
        break;
      case 'status':
        this.sortedNodes.sort(this.sortStatusAscending);
        break;
      case '-status':
        this.sortedNodes.sort(this.sortStatusDescending);
        break;
      case 'score':
        this.sortedNodes.sort(this.sortScoreAscending);
        break;
      case '-score':
        this.sortedNodes.sort(this.sortScoreDescending);
        break;
    }
  }

  private sortStepAscending(nodeA: any, nodeB: any): number {
    if (nodeA.isVisible === nodeB.isVisible) {
      return nodeA.order - nodeB.order;
    } else {
      return nodeB.isVisible - nodeA.isVisible;
    }
  }

  private sortStepDescending(nodeA: any, nodeB: any): number {
    if (nodeA.isVisible === nodeB.isVisible) {
      return nodeB.order - nodeA.order;
    } else {
      return nodeB.isVisible - nodeA.isVisible;
    }
  }

  private sortStatusAscending(nodeA: any, nodeB: any): number {
    if (nodeA.isVisible === nodeB.isVisible) {
      if (nodeA.completionStatus === nodeB.completionStatus) {
        if (nodeA.hasNewAlert === nodeB.hasNewAlert) {
          return nodeA.order - nodeB.order;
        } else {
          return nodeB.hasNewAlert - nodeA.hasNewAlert;
        }
      } else {
        return nodeA.completionStatus - nodeB.completionStatus;
      }
    } else {
      return nodeB.isVisible - nodeA.isVisible;
    }
  }

  private sortStatusDescending(nodeA: any, nodeB: any): number {
    if (nodeA.isVisible === nodeB.isVisible) {
      if (nodeA.completionStatus === nodeB.completionStatus) {
        if (nodeA.hasNewAlert === nodeB.hasNewAlert) {
          return nodeA.order - nodeB.order;
        } else {
          return nodeB.hasNewAlert - nodeA.hasNewAlert;
        }
      } else {
        return nodeB.completionStatus - nodeA.completionStatus;
      }
    } else {
      return nodeB.isVisible - nodeA.isVisible;
    }
  }

  private sortScoreAscending(nodeA: any, nodeB: any): number {
    if (nodeA.isVisible === nodeB.isVisible) {
      if (nodeA.hasScore === nodeB.hasScore) {
        if (nodeA.hasMaxScore === nodeB.hasMaxScore) {
          if (nodeA.scorePct === nodeB.scorePct) {
            if (nodeA.maxScore === nodeB.maxScore) {
              if (nodeA.score === nodeB.score) {
                return nodeA.order - nodeB.order;
              } else {
                return nodeA.score - nodeB.score;
              }
            } else {
              return nodeB.maxScore - nodeA.maxScore;
            }
          } else {
            return nodeA.scorePct - nodeB.scorePct;
          }
        } else {
          return nodeB.hasMaxScore - nodeA.hasMaxScore;
        }
      } else {
        return nodeB.hasScore - nodeA.hasScore;
      }
    } else {
      return nodeB.isVisible - nodeA.isVisible;
    }
  }

  private sortScoreDescending(nodeA: any, nodeB: any): number {
    if (nodeA.isVisible === nodeB.isVisible) {
      if (nodeA.hasScore === nodeB.hasScore) {
        if (nodeA.hasMaxScore === nodeB.hasMaxScore) {
          if (nodeA.scorePct === nodeB.scorePct) {
            if (nodeA.maxScore === nodeB.maxScore) {
              if (nodeA.score === nodeB.score) {
                return nodeA.order - nodeB.order;
              } else {
                return nodeA.score - nodeB.score;
              }
            } else {
              return nodeB.maxScore - nodeA.maxScore;
            }
          } else {
            return nodeB.scorePct - nodeA.scorePct;
          }
        } else {
          return nodeB.hasMaxScore - nodeA.hasMaxScore;
        }
      } else {
        return nodeB.hasScore - nodeA.hasScore;
      }
    } else {
      return nodeB.isVisible - nodeA.isVisible;
    }
  }

  /**
   * Expand all nodes to show student work
   */
  expandAll(): void {
    for (let i = 0; i < this.nodeIds.length; i++) {
      const id = this.nodeIds[i];
      if (this.nodesInViewById[id]) {
        // the node is currently in view so we will expand it
        this.nodeVisibilityById[id] = true;
      }
    }

    // set the boolean flag to denote that we are currently expanding all the nodes
    this.isExpandAll = true;
  }

  /**
   * Collapse all nodes to hide student work
   */
  collapseAll(): void {
    for (let i = 0; i < this.nodeIds.length; i++) {
      const id = this.nodeIds[i];
      this.nodeVisibilityById[id] = false;
    }

    // set the boolean flag to denote that we are not currently expanding
    this.isExpandAll = false;
  }

  onUpdateExpand({ nodeId, value }): void {
    this.nodeVisibilityById[nodeId] = value;
  }

  onIntersection(nodeId: number, intersectionObserverEntries: IntersectionObserverEntry[]): void {
    for (const entry of intersectionObserverEntries) {
      this.nodesInViewById[nodeId] = entry.isIntersecting;
      if (this.isExpandAll && entry.isIntersecting) {
        this.nodeVisibilityById[nodeId] = true;
      }
    }
  }

  trackNode(index: number, node: any): string {
    return `${node.id}-${node.score}-${node.maxScore}`;
  }
}
