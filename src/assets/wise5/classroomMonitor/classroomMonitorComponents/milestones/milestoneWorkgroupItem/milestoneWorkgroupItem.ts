'use strict';

import { TeacherProjectService } from '../../../../services/teacherProjectService';
import * as angular from 'angular';
import { UtilService } from '../../../../services/utilService';
import { WorkgroupItemController } from '../../nodeGrading/workgroupItem/workgroupItem';

class MilestoneWorkgroupItemController extends WorkgroupItemController {
  $translate: any;
  locations: any[];
  changeInScore: any;
  componentId: string;
  components: any[] = [];
  disabled: any;
  expand: any;
  hasAlert: boolean;
  hasNewAlert: boolean;
  hiddenComponents: string[] = [];
  initialScore: any;
  maxScore: number;
  nodeId: string;
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
    this.componentId = this.locations[this.locations.length - 1].componentId;
    this.nodeId = this.locations[this.locations.length - 1].nodeId;
    this.hiddenComponents = [];
    const component = this.ProjectService.getComponentByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    this.components.push(component);
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

  isComponentVisible(componentId: string): boolean {
    return !this.hiddenComponents.includes(componentId);
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
    hiddenComponents: '<',
    onUpdateExpand: '&'
  },
  controller: MilestoneWorkgroupItemController,
  templateUrl:
    '/assets/wise5/classroomMonitor/classroomMonitorComponents/milestones/milestoneWorkgroupItem/milestoneWorkgroupItem.html'
};

export default MilestoneWorkgroupItem;
