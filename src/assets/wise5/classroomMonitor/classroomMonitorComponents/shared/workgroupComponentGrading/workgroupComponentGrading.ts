'use strict';

import * as angular from 'angular';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

class WorkgroupComponentGradingController {
  component: any;
  componentId: string;
  componentStates: any[];
  latestComponentState: any;
  nodeId: string;
  teacherWorkgroupId: number;
  workgroupId: number;

  static $inject = ['$mdDialog', 'ConfigService', 'ProjectService', 'TeacherDataService'];

  constructor(
    private $mdDialog: any,
    private ConfigService: ConfigService,
    private ProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService
  ) {}

  $onInit() {
    this.teacherWorkgroupId = this.ConfigService.getWorkgroupId();
    this.component = this.ProjectService.getComponentByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    this.componentStates = this.TeacherDataService.getComponentStatesByWorkgroupIdAndComponentId(
      this.workgroupId,
      this.componentId
    );

    this.latestComponentState = this.TeacherDataService.getLatestComponentStateByWorkgroupIdNodeIdAndComponentId(
      this.workgroupId,
      this.nodeId,
      this.componentId
    );
  }

  showRevisions($event) {
    this.$mdDialog.show({
      multiple: true,
      parent: angular.element(document.body),
      targetEvent: $event,
      fullscreen: true,
      template: `
          <md-dialog aria-label="{{ ::'revisionsForTeam' | translate:{teamNames: usernames} }}" class="dialog--wider">
            <md-toolbar>
              <div class="md-toolbar-tools">
                <h2 class="overflow--ellipsis">{{ ::'revisionsForTeam' | translate:{teamNames: usernames} }}</h2>
              </div>
            </md-toolbar>
            <md-dialog-content>
              <div class="md-dialog-content gray-lighter-bg">
                <workgroup-component-revisions component-states="componentStates"
                    node-id="{{ nodeId }}"
                    component-id="{{ componentId }}"
                    from-workgroup-id="{{ fromWorkgroupId }}"
                    workgroup-id="{{ workgroupId }}"></workgroup-component-revisions>
              </div>
            </md-dialog-content>
            <md-dialog-actions layout="row" layout-align="end center">
              <md-button class="md-primary" ng-click="close()" aria-label="{{ ::'close' | translate }}">{{ ::'close' | translate }}</md-button>
            </md-dialog-actions>
        </md-dialog>`,
      locals: {
        workgroupId: this.workgroupId,
        fromWorkgroupId: this.teacherWorkgroupId,
        componentId: this.componentId,
        nodeId: this.nodeId,
        usernames: this.ConfigService.getDisplayNamesByWorkgroupId(this.workgroupId),
        componentStates: this.componentStates
      },
      controller: RevisionsController
    });
    function RevisionsController(
      $scope,
      $mdDialog,
      workgroupId,
      fromWorkgroupId,
      componentId,
      nodeId,
      usernames,
      componentStates
    ) {
      $scope.workgroupId = workgroupId;
      $scope.fromWorkgroupId = fromWorkgroupId;
      $scope.componentId = componentId;
      $scope.nodeId = nodeId;
      $scope.usernames = usernames;
      $scope.componentStates = componentStates;
      $scope.close = () => {
        $mdDialog.hide();
      };
    }
    RevisionsController.$inject = [
      '$scope',
      '$mdDialog',
      'workgroupId',
      'fromWorkgroupId',
      'componentId',
      'nodeId',
      'usernames',
      'componentStates'
    ];
  }
}

const WorkgroupComponentGrading = {
  bindings: {
    nodeId: '<',
    componentId: '<',
    workgroupId: '<'
  },
  templateUrl:
    '/assets/wise5/classroomMonitor/classroomMonitorComponents/shared/workgroupComponentGrading/workgroupComponentGrading.html',
  controller: WorkgroupComponentGradingController
};

export default WorkgroupComponentGrading;
