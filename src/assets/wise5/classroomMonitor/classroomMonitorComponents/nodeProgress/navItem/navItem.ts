'use strict';

import { AnnotationService } from '../../../../services/annotationService';
import { ConfigService } from '../../../../services/configService';
import { NotificationService } from '../../../../services/notificationService';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherWebSocketService } from '../../../../services/teacherWebSocketService';
import * as $ from 'jquery';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { Subscription } from 'rxjs';
import { Directive } from '@angular/core';

@Directive()
class NavItemController {
  $translate: any;
  alertIconClass: string;
  alertIconLabel: string;
  alertIconName: string;
  alertNotifications: any;
  currentNode: any;
  currentNodeStatus: any;
  currentPeriod: any;
  currentWorkgroup: any;
  expanded: boolean = false;
  hasAlert: boolean = false;
  hasRubrics: boolean;
  icon: any;
  isCurrentNode: boolean;
  isGroup: boolean;
  item: any;
  maxScore: number;
  newAlert: boolean = false;
  nodeHasWork: boolean;
  nodeId: string;
  nodeTitle: string;
  parentGroupId: string = null;
  rubricIconClass: string;
  rubricIconLabel: string;
  rubricIconName: string;
  showPosition: any;
  workgroupsOnNodeData: any = [];
  subscriptions: Subscription = new Subscription();

  static $inject = [
    '$element',
    '$filter',
    '$mdToast',
    '$scope',
    'AnnotationService',
    'ClassroomStatusService',
    'ConfigService',
    'NotificationService',
    'ProjectService',
    'TeacherDataService',
    'TeacherWebSocketService'
  ];

  constructor(
    private $element: any,
    $filter: any,
    private $mdToast: any,
    private $scope: any,
    private AnnotationService: AnnotationService,
    private classroomStatusService: ClassroomStatusService,
    private ConfigService: ConfigService,
    private NotificationService: NotificationService,
    private ProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService,
    private TeacherWebSocketService: TeacherWebSocketService
  ) {
    this.$translate = $filter('translate');
  }

  $onInit() {
    this.item = this.ProjectService.idToNode[this.nodeId];
    this.isGroup = this.ProjectService.isGroupNode(this.nodeId);
    this.nodeHasWork = this.ProjectService.nodeHasWork(this.nodeId);
    this.nodeTitle = this.showPosition
      ? this.ProjectService.nodeIdToNumber[this.nodeId] + ': ' + this.item.title
      : this.item.title;
    this.currentNode = this.TeacherDataService.currentNode;
    this.isCurrentNode = this.currentNode.id === this.nodeId;
    this.currentPeriod = this.TeacherDataService.getCurrentPeriod();
    this.currentWorkgroup = this.TeacherDataService.getCurrentWorkgroup();
    this.setCurrentNodeStatus();
    this.maxScore = this.ProjectService.getMaxScoreForNode(this.nodeId);
    this.icon = this.ProjectService.getNode(this.nodeId).getIcon();
    const parentGroup = this.ProjectService.getParentGroup(this.nodeId);
    if (parentGroup != null) {
      this.parentGroupId = parentGroup.id;
    }
    this.setWorkgroupsOnNodeData();
    this.getAlertNotifications();
    this.hasRubrics = this.ProjectService.getNumberOfRubricsByNodeId(this.nodeId) > 0;
    this.alertIconLabel = this.$translate('HAS_ALERTS_NEW');
    this.alertIconClass = 'warn';
    this.alertIconName = 'notifications';
    this.rubricIconLabel = this.$translate('STEP_HAS_RUBRICS_TIPS');
    this.rubricIconClass = 'info';
    this.rubricIconName = 'info';
    this.watchCurrentNode();
    this.watchExpanded();
    this.subscribeStudentStatusReceived();
    this.subscribeCurrentPeriodChanged();
  }

  $onDestroy() {
    this.subscriptions.unsubscribe();
  }

  watchCurrentNode(): void {
    this.$scope.$watch(
      () => {
        return this.TeacherDataService.currentNode;
      },
      (newNode, oldNode) => {
        this.currentNode = newNode;
        this.isCurrentNode = this.nodeId === newNode.id;
        let isPrev = false;
        if (this.ProjectService.isApplicationNode(newNode.id)) {
          return;
        }
        if (oldNode) {
          isPrev = this.nodeId === oldNode.id;
          if (this.TeacherDataService.previousStep) {
            this.$scope.$parent.isPrevStep =
              this.nodeId === this.TeacherDataService.previousStep.id;
          }
          if (isPrev && !this.isGroup) {
            this.zoomToElement();
          }
        }

        if (this.isGroup) {
          const prevNodeisGroup = !oldNode || this.ProjectService.isGroupNode(oldNode.id);
          const prevNodeIsDescendant = this.ProjectService.isNodeDescendentOfGroup(
            oldNode,
            this.item
          );
          if (this.isCurrentNode) {
            this.expanded = true;
            if (prevNodeisGroup || !prevNodeIsDescendant) {
              this.zoomToElement();
            }
          } else {
            if (!prevNodeisGroup) {
              if (prevNodeIsDescendant) {
                this.expanded = true;
              } else {
                this.expanded = false;
              }
            }
          }
        } else {
          if (isPrev && this.ProjectService.isNodeDescendentOfGroup(this.item, newNode)) {
            this.zoomToElement();
          }
        }
      }
    );
  }

  watchExpanded(): void {
    this.$scope.$watch(
      () => {
        return this.expanded;
      },
      (value) => {
        this.$scope.$parent.itemExpanded = value;
      }
    );
  }

  subscribeStudentStatusReceived(): void {
    this.subscriptions.add(
      this.classroomStatusService.studentStatusReceived$.subscribe(() => {
        this.setWorkgroupsOnNodeData();
        this.setCurrentNodeStatus();
        this.getAlertNotifications();
      })
    );
  }

  subscribeCurrentPeriodChanged(): void {
    this.subscriptions.add(
      this.TeacherDataService.currentPeriodChanged$.subscribe(({ currentPeriod }) => {
        this.currentPeriod = currentPeriod;
        this.setWorkgroupsOnNodeData();
        this.getAlertNotifications();
      })
    );
  }

  zoomToElement(): void {
    setTimeout(() => {
      // smooth scroll to expanded group's page location
      const top = this.$element[0].offsetTop;
      const location = this.isGroup ? top - 32 : top - 80;
      const delay = 350;
      $('#content').animate(
        {
          scrollTop: location
        },
        delay,
        'linear'
      );
    }, 500);
  }

  itemClicked(): void {
    if (this.isGroup) {
      this.groupItemClicked();
    } else {
      this.TeacherDataService.endCurrentNodeAndSetCurrentNodeByNodeId(this.nodeId);
    }
  }

  groupItemClicked(): void {
    this.expanded = !this.expanded;
    if (this.expanded) {
      if (this.isCurrentNode) {
        this.zoomToElement();
      } else {
        this.TeacherDataService.endCurrentNodeAndSetCurrentNodeByNodeId(this.nodeId);
      }
    }
  }

  isLocked(): boolean {
    const constraints = this.ProjectService.getNodeById(this.nodeId).constraints;
    if (constraints == null) {
      return false;
    } else {
      return (
        (this.isShowingAllPeriods() && this.isLockedForAll(constraints)) ||
        (!this.isShowingAllPeriods() &&
          this.isLockedForPeriod(constraints, this.TeacherDataService.getCurrentPeriod().periodId))
      );
    }
  }

  isLockedForAll(constraints: any): boolean {
    for (const period of this.TeacherDataService.getPeriods()) {
      if (period.periodId !== -1 && !this.isLockedForPeriod(constraints, period.periodId)) {
        return false;
      }
    }
    return true;
  }

  isLockedForPeriod(constraints: any, periodId: number): boolean {
    for (const constraint of constraints) {
      if (
        constraint.action === 'makeThisNodeNotVisitable' &&
        constraint.targetId === this.nodeId &&
        constraint.removalCriteria[0].params.periodId === periodId
      ) {
        return true;
      }
    }
    return false;
  }

  toggleLockNode(): void {
    const node = this.ProjectService.getNodeById(this.nodeId);
    const isLocked = this.isLocked();
    if (isLocked) {
      this.unlockNode(node);
    } else {
      this.lockNode(node);
    }
    this.ProjectService.saveProject().then(() => {
      this.sendNodeToClass(node);
      this.showToggleLockNodeConfirmation(!isLocked);
    });
  }

  showToggleLockNodeConfirmation(isLocked: boolean): void {
    let message = '';
    if (isLocked) {
      message = this.$translate('lockNodeConfirmation', {
        nodeTitle: this.nodeTitle,
        periodName: this.getPeriodLabel()
      });
    } else {
      message = this.$translate('unlockNodeConfirmation', {
        nodeTitle: this.nodeTitle,
        periodName: this.getPeriodLabel()
      });
    }
    this.$mdToast.show(this.$mdToast.simple().textContent(message).hideDelay(5000));
  }

  unlockNode(node: any): void {
    if (this.isShowingAllPeriods()) {
      this.unlockNodeForAllPeriods(node);
    } else {
      this.ProjectService.removeTeacherRemovalConstraint(
        node,
        this.TeacherDataService.getCurrentPeriod().periodId
      );
    }
  }

  lockNode(node: any): void {
    if (this.isShowingAllPeriods()) {
      this.lockNodeForAllPeriods(node);
    } else {
      this.ProjectService.addTeacherRemovalConstraint(
        node,
        this.TeacherDataService.getCurrentPeriod().periodId
      );
    }
  }

  unlockNodeForAllPeriods(node: any): void {
    for (const period of this.TeacherDataService.getPeriods()) {
      this.ProjectService.removeTeacherRemovalConstraint(node, period.periodId);
    }
  }

  lockNodeForAllPeriods(node: any): void {
    for (const period of this.TeacherDataService.getPeriods()) {
      if (period.periodId !== -1 && !this.isLockedForPeriod(node.constraints, period.periodId)) {
        this.ProjectService.addTeacherRemovalConstraint(node, period.periodId);
      }
    }
  }

  isShowingAllPeriods(): boolean {
    return this.TeacherDataService.getCurrentPeriod().periodId === -1;
  }

  sendNodeToClass(node: any): void {
    if (this.isShowingAllPeriods()) {
      this.sendNodeToAllPeriods(node);
    } else {
      this.sendNodeToPeriod(node, this.currentPeriod.periodId);
    }
  }

  sendNodeToAllPeriods(node: any): void {
    for (const period of this.TeacherDataService.getPeriods()) {
      if (period.periodId !== -1) {
        this.sendNodeToPeriod(node, period.periodId);
      }
    }
  }

  sendNodeToPeriod(node: any, periodId: number): void {
    this.TeacherWebSocketService.sendNodeToClass(periodId, node);
  }

  getNodeCompletion(): number {
    return this.classroomStatusService.getNodeCompletion(
      this.nodeId,
      this.currentPeriod.periodId,
      null,
      true
    ).completionPct;
  }

  getNodeAverageScore(): any {
    const workgroupId = this.currentWorkgroup ? this.currentWorkgroup.workgroupId : null;
    if (workgroupId) {
      return this.AnnotationService.getTotalNodeScoreForWorkgroup(workgroupId, this.nodeId);
    } else {
      return this.classroomStatusService.getNodeAverageScore(
        this.nodeId,
        this.currentPeriod.periodId
      );
    }
  }

  getWorkgroupIdsOnNode(): any[] {
    return this.classroomStatusService.getWorkgroupIdsOnNode(
      this.nodeId,
      this.currentPeriod.periodId
    );
  }

  setWorkgroupsOnNodeData(): void {
    this.workgroupsOnNodeData = [];
    for (const workgroupId of this.getWorkgroupIdsOnNode()) {
      this.workgroupsOnNodeData.push({
        workgroupId: workgroupId,
        usernames: this.ConfigService.getDisplayUsernamesByWorkgroupId(workgroupId),
        avatarColor: this.ConfigService.getAvatarColorForWorkgroupId(workgroupId)
      });
    }
  }

  setCurrentNodeStatus(): void {
    if (this.currentWorkgroup) {
      const studentStatus = this.classroomStatusService.getStudentStatusForWorkgroupId(
        this.currentWorkgroup.workgroupId
      );
      this.currentNodeStatus = studentStatus.nodeStatuses[this.nodeId];
    }
  }

  getAlertNotifications(): void {
    this.alertNotifications = this.NotificationService.getAlertNotifications({
      nodeId: this.nodeId,
      periodId: this.currentPeriod.periodId,
      toWorkgroupId: this.currentWorkgroup ? this.currentWorkgroup.workgroupId : null
    });
    this.hasAlert = this.alertNotifications.length > 0;
    this.newAlert = this.hasNewAlert();
  }

  hasNewAlert(): boolean {
    for (const alert of this.alertNotifications) {
      if (!alert.timeDismissed) {
        return true;
      }
    }
    return false;
  }

  getPeriodLabel(): string {
    return this.isShowingAllPeriods()
      ? this.$translate('allPeriods')
      : this.$translate('periodLabel', { name: this.currentPeriod.periodName });
  }

  getNodeLockedText(): string {
    if (this.isLocked()) {
      return this.$translate('unlockNodeForPeriod', { periodName: this.getPeriodLabel() });
    } else {
      return this.$translate('lockNodeForPeriod', { periodName: this.getPeriodLabel() });
    }
  }
}

const NavItem = {
  bindings: {
    nodeId: '<',
    showPosition: '<',
    type: '<'
  },
  templateUrl:
    '/assets/wise5/classroomMonitor/classroomMonitorComponents/nodeProgress/navItem/navItem.html',
  controller: NavItemController
};

export default NavItem;
