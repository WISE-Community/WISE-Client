'use strict';

import { TeacherProjectService } from '../../../../services/teacherProjectService';
import * as angular from 'angular';
import { UtilService } from '../../../../services/utilService';
import { WorkgroupItemController } from '../../nodeGrading/workgroupItem/workgroupItem';
import { Subscription } from 'rxjs';

class MilestoneWorkgroupItemController extends WorkgroupItemController {
  $translate: any;
  locations: any[];
  changeInScore: any;
  components: any[] = [];
  disabled: any;
  expand: any;
  firstComponent: any;
  firstComponentId: string;
  firstNodeId: string;
  firstComponentMaxScore: number;
  hasAlert: boolean;
  hasNewAlert: boolean;
  initialScore: any;
  lastComponent: any;
  lastComponentId: string;
  lastNodeId: string;
  lastComponentMaxScore: number;
  maxScore: number;
  onUpdateExpand: any;
  score: any;
  showScore: boolean;
  status: any;
  statusClass: any;
  statusText: string;
  subscriptions: Subscription = new Subscription();
  workgroupId: number;

  static $inject = ['$filter', 'ProjectService', 'UtilService'];

  constructor(
    $filter: any,
    protected ProjectService: TeacherProjectService,
    protected UtilService: UtilService
  ) {
    super($filter, ProjectService, UtilService);
  }

  $onInit() {
    this.statusText = '';
    this.update();
    this.initLastLocation();
    if (this.locations.length > 1) {
      this.initFirstLocation();
    }
    this.subscribeToEvents();
  }

  private initLastLocation() {
    const lastLocation = this.locations[this.locations.length - 1];
    this.lastNodeId = lastLocation.nodeId;
    this.lastComponentId = lastLocation.componentId;
    this.lastComponent = this.ProjectService.getComponentByNodeIdAndComponentId(
      this.lastNodeId,
      this.lastComponentId
    );
    this.lastComponentMaxScore = this.ProjectService.getMaxScoreForComponent(
      this.lastNodeId,
      this.lastComponentId
    );
  }

  private initFirstLocation() {
    const firstLocation = this.locations[0];
    this.firstComponentId = firstLocation.componentId;
    this.firstNodeId = firstLocation.nodeId;
    this.firstComponent = this.ProjectService.getComponentByNodeIdAndComponentId(
      this.firstNodeId,
      this.firstComponentId
    );
    this.firstComponentMaxScore = this.ProjectService.getMaxScoreForComponent(
      this.firstNodeId,
      this.firstComponentId
    );
  }

  subscribeToEvents() {
    this.subscriptions.add(
      this.ProjectService.projectSaved$.subscribe(() => {
        this.lastComponentMaxScore = this.ProjectService.getMaxScoreForComponent(
          this.lastNodeId,
          this.lastComponentId
        );
        if (this.locations.length > 1) {
          this.firstComponentMaxScore = this.ProjectService.getMaxScoreForComponent(
            this.firstNodeId,
            this.firstComponentId
          );
        }
      })
    );
  }

  $onChanges(changesObj) {
    if (changesObj.workgroupData) {
      let workgroupData = angular.copy(changesObj.workgroupData.currentValue);
      this.hasAlert = workgroupData.hasAlert;
      this.hasNewAlert = workgroupData.hasNewAlert;
      this.status = workgroupData.completionStatus;
      this.score = workgroupData.score != null ? workgroupData.score : '-';
      this.initialScore = workgroupData.initialScore != null ? workgroupData.initialScore : '-';
      this.changeInScore =
        workgroupData.score != null && workgroupData.initialScore != null
          ? workgroupData.score - workgroupData.initialScore
          : '-';
    }
    this.update();
  }

  $onDestroy() {
    this.subscriptions.unsubscribe();
  }

  getComponentTypeLabel(componentType) {
    return this.UtilService.getComponentTypeLabel(componentType);
  }

  getNodePosition(nodeId: string): string {
    return this.ProjectService.getNodePositionById(nodeId);
  }

  update() {
    switch (this.status) {
      case -1:
        this.statusClass = ' ';
        this.statusText = this.$translate('notAssigned');
        break;
      case 2:
        this.statusClass = 'success';
        this.statusText = this.$translate('completed');
        break;
      case 1:
        this.statusClass = 'text';

        this.statusText = this.$translate('partiallyCompleted');
        break;
      default:
        this.statusClass = 'text-secondary';
        if (this.componentId) {
          this.statusText = this.$translate('notCompleted');
        } else {
          this.statusText = this.$translate('noWork');
        }
    }

    if (this.hasNewAlert) {
      this.statusClass = 'warn';
    }

    this.disabled = this.status === -1;
  }

  toggleExpand() {
    if (this.showScore) {
      let expand = !this.expand;
      this.onUpdateExpand({ workgroupId: this.workgroupId, value: expand });
    }
  }
}

const MilestoneWorkgroupItem = {
  bindings: {
    expand: '<',
    locations: '<',
    showScore: '<',
    workgroupId: '<',
    workgroupData: '<',
    onUpdateExpand: '&'
  },
  controller: MilestoneWorkgroupItemController,
  templateUrl:
    '/assets/wise5/classroomMonitor/classroomMonitorComponents/milestones/milestoneWorkgroupItem/milestoneWorkgroupItem.html'
};

export default MilestoneWorkgroupItem;
