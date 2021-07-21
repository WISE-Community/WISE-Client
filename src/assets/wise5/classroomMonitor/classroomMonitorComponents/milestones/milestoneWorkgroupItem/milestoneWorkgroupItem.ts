'use strict';

import { TeacherProjectService } from '../../../../services/teacherProjectService';
import * as angular from 'angular';
import { UtilService } from '../../../../services/utilService';
import { WorkgroupItemController } from '../../nodeGrading/workgroupItem/workgroupItem';

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
  hasAlert: boolean;
  hasNewAlert: boolean;
  initialScore: any;
  lastComponent: any;
  lastComponentId: string;
  lastNodeId: string;
  maxScore: number;
  onUpdateExpand: any;
  score: any;
  showScore: boolean;
  status: any;
  statusClass: any;
  statusText: string;
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
    this.firstComponentId = this.locations[0].componentId;
    this.firstNodeId = this.locations[0].nodeId;
    this.firstComponent = this.ProjectService.getComponentByNodeIdAndComponentId(
      this.firstNodeId,
      this.firstComponentId
    );
    if (this.locations.length > 1) {
      const lastLocation = this.locations[this.locations.length - 1];
      this.lastNodeId = lastLocation.nodeId;
      this.lastComponentId = lastLocation.componentId;
      this.lastComponent = this.ProjectService.getComponentByNodeIdAndComponentId(
        this.lastNodeId,
        this.lastComponentId
      );
    }
  }

  $onChanges(changesObj) {
    if (changesObj.maxScore) {
      this.maxScore =
        typeof changesObj.maxScore.currentValue === 'number' ? changesObj.maxScore.currentValue : 0;
    }

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

  getComponentTypeLabel(componentType) {
    return this.UtilService.getComponentTypeLabel(componentType);
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
    maxScore: '<',
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
