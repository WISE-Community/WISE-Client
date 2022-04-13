'use strict';

import { TeacherProjectService } from '../../../../services/teacherProjectService';
import * as angular from 'angular';
import { UtilService } from '../../../../services/utilService';

export class WorkgroupItemController {
  $translate: any;
  componentId: string;
  components: any[] = [];
  disabled: any;
  expand: any;
  hasAlert: boolean;
  hasNewAlert: boolean;
  hiddenComponents: string[] = [];
  maxScore: number;
  nodeHasWork: boolean;
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
    this.$translate = $filter('translate');
  }

  $onInit() {
    this.nodeHasWork = this.ProjectService.nodeHasWork(this.nodeId);
    this.statusText = '';
    this.update();
    if (this.componentId) {
      this.hiddenComponents = [];
      const component = this.ProjectService.getComponentByNodeIdAndComponentId(
        this.nodeId,
        this.componentId
      );
      if (this.ProjectService.componentHasWork(component)) {
        this.components.push(component);
      }
    } else {
      this.components = this.ProjectService.getComponentsByNodeId(this.nodeId).filter(
        (component) => {
          return this.ProjectService.componentHasWork(component);
        }
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

        if (this.nodeHasWork) {
          this.statusText = this.$translate('completed');
        } else {
          this.statusText = this.$translate('visited');
        }
        break;
      case 1:
        this.statusClass = 'text';

        this.statusText = this.$translate('partiallyCompleted');
        break;
      default:
        this.statusClass = 'text-secondary';
        if (this.componentId) {
          this.statusText = this.$translate('notCompleted');
        } else if (this.nodeHasWork) {
          this.statusText = this.$translate('noWork');
        } else {
          this.statusText = this.$translate('notVisited');
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

const WorkgroupItem = {
  bindings: {
    expand: '<',
    maxScore: '<',
    nodeId: '<',
    componentId: '<',
    showScore: '<',
    workgroupId: '<',
    workgroupData: '<',
    hiddenComponents: '<',
    onUpdateExpand: '&'
  },
  controller: WorkgroupItemController,
  template: `<div class="md-whiteframe-1dp" ng-class="{'list-item--warn': $ctrl.statusClass === 'warn', 'list-item--info': $ctrl.statusClass === 'info'}">
            <md-subheader class="list-item md-whiteframe-1dp">
                <button class="md-button md-ink-ripple list-item__subheader-button"
                               aria-label="{{ ::toggleTeamWorkDisplay | translate }}"
                               ng-class="{'list-item--expanded': $ctrl.showWork,
                                   'list-item--noclick': !$ctrl.showScore || $ctrl.disabled}"
                               ng-click="$ctrl.toggleExpand()"
                               ng-disabled="$ctrl.disabled"
                               layout-wrap>
                    <div layout="row" flex>
                        <div flex layout="row" layout-align="start center">
                            <workgroup-info [has-alert]="$ctrl.hasAlert" [has-new-alert]="$ctrl.hasNewAlert" [has-new-work]="$ctrl.hasNewWork" [usernames]="$ctrl.workgroupData.displayNames" [workgroup-id]="$ctrl.workgroupId"></workgroup-info>
                        </div>
                        <div flex="{{$ctrl.showScore ? 30 : 20}}" layout="row" layout-align="center center">
                            <workgroup-node-status [status-text]="$ctrl.statusText" [status-class]="$ctrl.statusClass"></workgroup-node-status>
                        </div>
                        <div ng-if="$ctrl.showScore" flex="20" layout="row" layout-align="center center">
                            <workgroup-node-score [score]="$ctrl.score" [max-score]="$ctrl.maxScore"></workgroup-node-score>
                        </div>
                    </div>
                </button>
            </md-subheader>
            <md-list-item ng-if="$ctrl.expand && !$ctrl.disabled" class="grading__item-container">
                <div class="grading__item" style="width:100%">
                  <div id="component_{{::component.id}}_{{::$ctrl.workgroupId}}" class="component component--grading" ng-repeat='component in $ctrl.components'>
                    <div ng-show="$ctrl.isComponentVisible(component.id)">
                      <h3 class="accent-1 md-body-2 gray-lightest-bg component__header">
                        {{ $index+1 + '. ' + $ctrl.getComponentTypeLabel(component.type) }}&nbsp;
                        <component-new-work-badge [component-id]="component.id"
                                                  [workgroup-id]="$ctrl.workgroupId"
                                                  [node-id]="$ctrl.nodeId"></component-new-work-badge>
                      </h3>
                      <workgroup-component-grading [component-id]="component.id"
                          [workgroup-id]="$ctrl.workgroupId"
                          [node-id]="$ctrl.nodeId"></workgroup-component-grading>
                    </div>
                  </div>
                </div>
            </md-list-item>
        </div>`
};

export default WorkgroupItem;
