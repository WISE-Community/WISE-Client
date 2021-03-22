'use strict';

import * as angular from 'angular';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

class StepItemController {
  $translate: any;
  disabled: boolean;
  expand: boolean;
  hasAlert: boolean;
  hasNewAlert: boolean;
  maxScore: number;
  nodeId: string;
  onUpdateExpand: any;
  score: any;
  showScore: boolean;
  status: any;
  statusClass: string;
  statusText: string;
  title: string;
  components: any[];

  static $inject = ['$filter', 'ProjectService'];

  constructor($filter: any, private ProjectService: TeacherProjectService) {
    this.$translate = $filter('translate');
    this.statusText = '';
  }

  $onInit() {
    this.components = this.ProjectService.getComponentsByNodeId(this.nodeId).filter((component) => {
      return this.ProjectService.componentHasWork(component);
    });
  }

  $onChanges(changesObj) {
    if (changesObj.maxScore) {
      this.maxScore =
        typeof changesObj.maxScore.currentValue === 'number' ? changesObj.maxScore.currentValue : 0;
    }
    if (changesObj.stepData) {
      let stepData = angular.copy(changesObj.stepData.currentValue);
      this.title = stepData.title;
      this.hasAlert = stepData.hasAlert;
      this.hasNewAlert = stepData.hasNewAlert;
      this.status = stepData.completionStatus;
      this.score = stepData.score >= 0 ? stepData.score : '-';
    }
    this.update();
  }

  update() {
    switch (this.status) {
      case -1:
        this.statusClass = ' ';
        this.statusText = this.$translate('notAssigned');
        break;
      case 2:
        this.statusClass = 'success';
        if (this.showScore) {
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
        if (this.showScore) {
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
      this.onUpdateExpand({ nodeId: this.nodeId, value: expand });
    }
  }
}

const StepItem = {
  bindings: {
    expand: '<',
    maxScore: '<',
    nodeId: '<',
    showScore: '<',
    workgroupId: '<',
    stepData: '<',
    onUpdateExpand: '&'
  },
  controller: StepItemController,
  template: `<div class="md-whiteframe-1dp"
          ng-class="{ 'list-item--warn': $ctrl.statusClass === 'warn', 'list-item--info': $ctrl.statusClass === 'info' }">
      <md-subheader class="list-item md-whiteframe-1dp">
        <button class="md-button md-ink-ripple list-item__subheader-button"
                aria-label="{{ ::toggleTeamWorkDisplay | translate }}"
                ng-class="{ 'list-item--noclick': !$ctrl.showScore || $ctrl.disabled }"
                ng-click="$ctrl.toggleExpand()"
                ng-disabled="$ctrl.disabled"
                layout-wrap>
          <div layout="row" flex>
            <div flex layout="row" layout-align="start center">
              <step-info [has-alert]="$ctrl.hasAlert"
                         [has-new-alert]="$ctrl.hasNewAlert"
                         [has-new-work]="$ctrl.hasNewWork"
                         [node-id]="::$ctrl.nodeId"></step-info>
            </div>
            <div flex="{{ $ctrl.showScore ? 30 : 20 }}" layout="row" layout-align="center center">
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
              <h3 class="accent-1 md-body-2 gray-lightest-bg component__header">
                {{ $index+1 + '. ' + $ctrl.getComponentTypeLabel(component.type) }}&nbsp;
                <component-new-work-badge [component-id]="component.id"
                                          [workgroup-id]="$ctrl.workgroupId"
                                          [node-id]="$ctrl.nodeId"></component-new-work-badge>
              </h3>
              <workgroup-component-grading component-id="component.id"
                  workgroup-id="$ctrl.workgroupId"
                  node-id="$ctrl.nodeId"></workgroup-component-grading>
            </div>
          </div>
      </md-list-item>
    </div>`
};

export default StepItem;
