'use strict';

import { AnnotationService } from '../../../../services/annotationService';
import { ConfigService } from '../../../../services/configService';
import { NodeService } from '../../../../services/nodeService';
import { MilestoneService } from '../../../../services/milestoneService';
import { NotificationService } from '../../../../services/notificationService';
import { PeerGroupService } from '../../../../services/peerGroupService';
import { StudentStatusService } from '../../../../services/studentStatusService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import * as angular from 'angular';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { Subscription } from 'rxjs';
import { Directive } from '@angular/core';
import { Notification } from '../../../../../../app/domain/notification';
import { CompletionStatus } from '../../shared/CompletionStatus';
import { Node } from '../../../../common/Node';

@Directive()
export class NodeGradingViewController {
  $translate: any;
  canViewStudentNames: boolean;
  hiddenComponents: any = [];
  isExpandAll: boolean;
  maxScore: any;
  milestone: any;
  milestoneReport: any;
  node: Node;
  nodeContent: any = null;
  nodeHasWork: boolean;
  nodeId: string;
  numRubrics: number;
  peerGroupComponentIds: string[];
  sortOrder: object = {
    team: ['-isVisible', 'workgroupId'],
    '-team': ['-isVisible', '-workgroupId'],
    status: ['-isVisible', 'completionStatus', 'workgroupId'],
    '-status': ['-isVisible', '-completionStatus', 'workgroupId'],
    score: ['-isVisible', 'score', 'workgroupId'],
    '-score': ['-isVisible', '-score', 'workgroupId']
  };
  sort: any;
  teacherWorkgroupId: number;
  workgroupInViewById: any = {}; // whether the workgroup is in view or not
  workgroups: any;
  workgroupsById: any = {};
  workVisibilityById: any = {}; // whether student work is visible for each workgroup
  subscriptions: Subscription = new Subscription();

  static $inject = [
    '$filter',
    'AnnotationService',
    'ConfigService',
    'MilestoneService',
    'NodeService',
    'NotificationService',
    'PeerGroupService',
    'ProjectService',
    'StudentStatusService',
    'TeacherDataService'
  ];

  constructor(
    protected $filter: any,
    protected AnnotationService: AnnotationService,
    protected ConfigService: ConfigService,
    protected MilestoneService: MilestoneService,
    protected NodeService: NodeService,
    protected NotificationService: NotificationService,
    protected PeerGroupService: PeerGroupService,
    protected ProjectService: TeacherProjectService,
    protected StudentStatusService: StudentStatusService,
    protected TeacherDataService: TeacherDataService
  ) {
    this.$translate = this.$filter('translate');
  }

  $onInit() {
    this.maxScore = this.getMaxScore();
    this.node = this.ProjectService.getNode(this.nodeId);
    this.nodeHasWork = this.ProjectService.nodeHasWork(this.nodeId);
    this.sort = this.TeacherDataService.nodeGradingSort;
    this.nodeContent = this.ProjectService.getNodeById(this.nodeId);
    this.milestoneReport = this.MilestoneService.getMilestoneReportByNodeId(this.nodeId);
    this.peerGroupComponentIds = this.PeerGroupService.getPeerGroupComponentIds(this.node);
    this.retrieveStudentData();
    this.subscribeToEvents();
  }

  $onDestroy() {
    this.subscriptions.unsubscribe();
  }

  subscribeToEvents() {
    this.subscriptions.add(
      this.ProjectService.projectSaved$.subscribe(() => {
        this.maxScore = this.getMaxScore();
      })
    );

    this.subscriptions.add(
      this.NotificationService.notificationChanged$.subscribe((notification) => {
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
      this.AnnotationService.annotationReceived$.subscribe(({ annotation }) => {
        const workgroupId = annotation.toWorkgroupId;
        if (annotation.nodeId === this.nodeId && this.workgroupsById[workgroupId]) {
          this.updateWorkgroup(workgroupId);
        }
      })
    );

    this.subscriptions.add(
      this.TeacherDataService.studentWorkReceived$.subscribe(({ studentWork }) => {
        const workgroupId = studentWork.workgroupId;
        if (studentWork.nodeId === this.nodeId && this.workgroupsById[workgroupId]) {
          this.updateWorkgroup(workgroupId);
        }
      })
    );

    this.subscriptions.add(
      this.TeacherDataService.currentPeriodChanged$.subscribe(() => {
        this.milestoneReport = this.MilestoneService.getMilestoneReportByNodeId(this.nodeId);
      })
    );
  }

  retrieveStudentData(node = this.node) {
    this.TeacherDataService.retrieveStudentDataForNode(node).then(() => {
      this.teacherWorkgroupId = this.ConfigService.getWorkgroupId();
      this.workgroups = this.ConfigService.getClassmateUserInfos();
      this.canViewStudentNames = this.ConfigService.getPermissions().canViewStudentNames;
      this.setWorkgroupsById();
      this.numRubrics = this.ProjectService.getNumberOfRubricsByNodeId(node.id);
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
    this.TeacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      event,
      data
    );
  }

  getMaxScore(nodeId = this.nodeId) {
    return this.ProjectService.getMaxScoreForNode(nodeId);
  }

  setWorkgroupsById() {
    for (const workgroup of this.workgroups) {
      const workgroupId = workgroup.workgroupId;
      this.workgroupsById[workgroupId] = workgroup;
      this.workVisibilityById[workgroupId] = false;
      this.updateWorkgroup(workgroupId, true);
    }
  }

  /**
   * Update statuses, scores, notifications, etc. for a workgroup object. Also check if we need to hide student
   * names because logged-in user does not have the right permissions
   * @param workgroupID a workgroup ID number
   * @param init Boolean whether we're in controller initialization or not
   */
  updateWorkgroup(workgroupId: number, init = false) {
    const workgroup = this.workgroupsById[workgroupId];
    const alertNotifications = this.NotificationService.getAlertNotifications({
      nodeId: this.nodeId,
      toWorkgroupId: workgroupId
    });
    workgroup.hasAlert = alertNotifications.length > 0;
    workgroup.hasNewAlert = this.workgroupHasNewAlert(alertNotifications);
    const completionStatus = this.getCompletionStatusByWorkgroupId(workgroupId);
    workgroup.isVisible = completionStatus.isVisible ? 1 : 0;
    workgroup.completionStatus = this.getWorkgroupCompletionStatus(completionStatus);
    workgroup.score = this.AnnotationService.getTotalNodeScoreForWorkgroup(
      workgroupId,
      this.nodeId
    );
    if (!init) {
      this.workgroupsById[workgroupId] = angular.copy(workgroup);
    }
  }

  workgroupHasNewAlert(alertNotifications: Notification[]): boolean {
    for (const alert of alertNotifications) {
      if (!alert.timeDismissed) {
        return true;
      }
    }
    return false;
  }

  getCompletionStatusByWorkgroupId(workgroupId: number): CompletionStatus {
    const completionStatus: CompletionStatus = {
      isCompleted: false,
      isVisible: false,
      latestWorkTime: null,
      latestAnnotationTime: null
    };
    const studentStatus = this.StudentStatusService.getStudentStatusForWorkgroupId(workgroupId);
    if (studentStatus != null) {
      const nodeStatus = studentStatus.nodeStatuses[this.nodeId];
      if (nodeStatus) {
        completionStatus.isVisible = nodeStatus.isVisible;
        completionStatus.latestWorkTime = this.getLatestWorkTimeByWorkgroupId(workgroupId); // TODO: store this info in the nodeStatus so we don't have to calculate every time?
        completionStatus.latestAnnotationTime = this.getLatestAnnotationTimeByWorkgroupId(
          workgroupId
        );
        if (!this.ProjectService.nodeHasWork(this.nodeId)) {
          completionStatus.isCompleted = nodeStatus.isVisited;
        }
        if (completionStatus.latestWorkTime) {
          completionStatus.isCompleted = nodeStatus.isCompleted;
        }
      }
    }
    return completionStatus;
  }

  getLatestWorkTimeByWorkgroupId(workgroupId: number): string {
    const componentStates = this.TeacherDataService.getComponentStatesByNodeId(this.nodeId);
    for (const componentState of componentStates.reverse()) {
      if (componentState.workgroupId === workgroupId) {
        return componentState.serverSaveTime;
      }
    }
    return null;
  }

  getLatestAnnotationTimeByWorkgroupId(workgroupId: number): string {
    const annotations = this.TeacherDataService.getAnnotationsByNodeId(this.nodeId);
    for (const annotation of annotations.reverse()) {
      // TODO: support checking for annotations from shared teachers
      if (
        annotation.toWorkgroupId === workgroupId &&
        annotation.fromWorkgroupId === this.ConfigService.getWorkgroupId()
      ) {
        return annotation.serverSaveTime;
      }
    }
    return null;
  }

  /**
   * Returns a numerical status value for a given completion status object depending on node completion
   * Available status values are: 0 (not visited/no work; default), 1 (partially completed), 2 (completed)
   * @param completionStatus Object
   * @returns Integer status value
   */
  getWorkgroupCompletionStatus(completionStatus: CompletionStatus) {
    // TODO: store this info in the nodeStatus so we don't have to calculate every time (and can use more widely)?
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

  getNodeCompletion(nodeId: string) {
    return this.StudentStatusService.getNodeCompletion(
      nodeId,
      this.TeacherDataService.getCurrentPeriodId()
    ).completionPct;
  }

  getNodeAverageScore() {
    const averageScore = this.StudentStatusService.getNodeAverageScore(
      this.nodeId,
      this.TeacherDataService.getCurrentPeriodId()
    );
    if (averageScore === null) {
      return 'N/A';
    } else {
      return this.$filter('number')(averageScore, 1);
    }
  }

  isWorkgroupShown(workgroup): boolean {
    return this.TeacherDataService.isWorkgroupShown(workgroup);
  }

  showRubric($event) {
    this.NodeService.showNodeInfo(this.nodeId, $event);
  }

  setSort(value) {
    if (this.sort === value) {
      this.sort = `-${value}`;
    } else {
      this.sort = value;
    }
    this.TeacherDataService.nodeGradingSort = this.sort;
  }

  getOrderBy() {
    return this.sortOrder[this.sort];
  }

  expandAll() {
    for (const workgroup of this.workgroups) {
      const workgroupId = workgroup.workgroupId;
      if (this.workgroupInViewById[workgroupId]) {
        this.workVisibilityById[workgroupId] = true;
      }
    }
    this.isExpandAll = true;
  }

  collapseAll() {
    for (const workgroup of this.workgroups) {
      this.workVisibilityById[workgroup.workgroupId] = false;
    }
    this.isExpandAll = false;
  }

  onUpdateExpand(workgroupId, isExpanded) {
    this.workVisibilityById[workgroupId] = isExpanded;
  }

  onUpdateHiddenComponents(value) {
    this.hiddenComponents = angular.copy(value);
  }

  /**
   * A workgroup row has either come into view or gone out of view
   * @param workgroupId the workgroup id that has come into view or gone out
   * of view
   * @param inview whether the row is in view or not
   */
  workgroupInView(workgroupId, inview) {
    this.workgroupInViewById[workgroupId] = inview;
    if (this.isExpandAll && inview) {
      this.workVisibilityById[workgroupId] = true;
    }
  }

  showReport($event) {
    this.MilestoneService.showMilestoneDetails(this.milestoneReport, $event);
  }

  showPeerGroupGroupings(nodeId: string, componentId: string): void {
    this.NodeService.showPeerGroupDetails(
      this.TeacherDataService.getCurrentPeriod().periodId,
      nodeId,
      componentId
    );
  }
}

const NodeGradingView = {
  bindings: {
    nodeId: '<'
  },
  controller: NodeGradingViewController,
  templateUrl:
    '/assets/wise5/classroomMonitor/classroomMonitorComponents/nodeGrading/nodeGradingView/nodeGradingView.html'
};

export default NodeGradingView;
