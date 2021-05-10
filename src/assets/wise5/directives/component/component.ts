import { ConfigService } from '../../services/configService';
import { NodeService } from '../../services/nodeService';
import { NotebookService } from '../../services/notebookService';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';
import * as angular from 'angular';

class ComponentController {
  componentId: string;
  componentState: any;
  mode: string;
  nodeId: string;
  teacherWorkgroupId: number;
  workgroupId: number;

  static $inject = [
    '$scope',
    'ConfigService',
    'NodeService',
    'NotebookService',
    'ProjectService',
    'StudentDataService'
  ];

  constructor(
    private $scope: any,
    private ConfigService: ConfigService,
    private NodeService: NodeService,
    private NotebookService: NotebookService,
    private ProjectService: ProjectService,
    private StudentDataService: StudentDataService
  ) {}

  $onInit() {
    this.$scope.mode = this.mode;

    if (this.componentState == null || this.componentState === '') {
      this.componentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
        this.nodeId,
        this.componentId
      );
    } else {
      this.componentState = angular.fromJson(this.componentState);
      this.nodeId = this.componentState.nodeId;
      this.componentId = this.componentState.componentId;
    }

    let componentContent = this.ProjectService.getComponentByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    componentContent = this.ProjectService.injectAssetPaths(componentContent);
    componentContent = this.ConfigService.replaceStudentNames(componentContent);
    if (
      this.NotebookService.isNotebookEnabled() &&
      this.NotebookService.isStudentNoteClippingEnabled()
    ) {
      componentContent = this.ProjectService.injectClickToSnipImage(componentContent);
    }

    this.$scope.componentTemplatePath = this.NodeService.getComponentTemplatePath(
      componentContent.type
    );
    this.$scope.componentContent = componentContent;
    this.$scope.componentState = this.componentState;
    this.$scope.nodeId = this.nodeId;
    this.$scope.workgroupId = this.workgroupId;
    this.$scope.teacherWorkgroupId = this.teacherWorkgroupId;
    this.$scope.type = componentContent.type;
    this.$scope.nodeController = this.$scope.$parent.nodeController;
  }
}

const Component = {
  bindings: {
    componentId: '@',
    componentState: '@',
    mode: '@',
    nodeId: '@',
    teacherWorkgroupId: '<',
    workgroupId: '<'
  },
  scope: true,
  controller: ComponentController,
  template: `<div ng-switch="type" class="component__wrapper">
          <div ng-switch-when="AudioOscillator|Draw|HTML|Label|MultipleChoice|OutsideURL" ng-switch-when-separator="|">
            <audio-oscillator-student ng-if="type === 'AudioOscillator'"
                [node-id]="nodeId"
                [component-content]="componentContent"
                [component-state]="componentState"
                [workgroup-id]="workgroupId"
                [mode]="mode">
            </audio-oscillator-student>
            <draw-student ng-if="type === 'Draw'"
                [node-id]="nodeId"
                [component-content]="componentContent"
                [component-state]="componentState"
                [workgroup-id]="workgroupId"
                [mode]="mode">
            </draw-student>
            <html-student ng-if="type === 'HTML'"
                [node-id]="nodeId"
                [component-content]="componentContent"
                [mode]="mode">
            </html-student>
            <label-student ng-if="type === 'Label'"
                [node-id]="nodeId"
                [component-content]="componentContent"
                [component-state]="componentState"
                [workgroup-id]="workgroupId"
                [mode]="mode">
            </label-student>
            <multiple-choice-student ng-if="type === 'MultipleChoice'"
                [node-id]="nodeId"
                [component-content]="componentContent"
                [component-state]="componentState"
                [workgroup-id]="workgroupId"
                [mode]="mode">
            </multiple-choice-student>
            <outside-url-student ng-if="type === 'OutsideURL'"
                [node-id]="nodeId"
                [component-content]="componentContent"
                [mode]="mode">
            </outside-url-student>
          </div>
          <div ng-switch-default>
            <div ng-include="::componentTemplatePath" class="component__content component__content--{{::type}}"></div>
          </div>
        </div>`
};

export default Component;
