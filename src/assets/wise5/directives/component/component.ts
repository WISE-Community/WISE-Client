import { ConfigService } from '../../services/configService';
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
    'NotebookService',
    'ProjectService',
    'StudentDataService'
  ];

  constructor(
    private $scope: any,
    private ConfigService: ConfigService,
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
          <animation-student ng-switch-when="Animation"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [component-state]="componentState"
              [workgroup-id]="workgroupId"
              [mode]="mode">
          </animation-student>
          <audio-oscillator-student ng-switch-when="AudioOscillator"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [component-state]="componentState"
              [workgroup-id]="workgroupId"
              [mode]="mode">
          </audio-oscillator-student>
          <concept-map-student ng-switch-when="ConceptMap"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [component-state]="componentState"
              [workgroup-id]="workgroupId"
              [mode]="mode">
          </concept-map-student>
          <dialog-guidance-student ng-switch-when="DialogGuidance"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [component-state]="componentState"
              [workgroup-id]="workgroupId"
              [mode]="mode">
          </dialog-guidance-student>
          <discussion-student ng-switch-when="Discussion"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [component-state]="componentState"
              [workgroup-id]="workgroupId"
              [mode]="mode">
          </discussion-student>
          <draw-student ng-switch-when="Draw"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [component-state]="componentState"
              [workgroup-id]="workgroupId"
              [mode]="mode">
          </draw-student>
          <embedded-student ng-switch-when="Embedded"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [component-state]="componentState"
              [workgroup-id]="workgroupId"
              [mode]="mode">
          </embedded-student>
          <graph-student ng-switch-when="Graph"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [component-state]="componentState"
              [workgroup-id]="workgroupId"
              [mode]="mode">
          </graph-student>
          <html-student ng-switch-when="HTML"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </html-student>
          <label-student ng-switch-when="Label"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [component-state]="componentState"
              [workgroup-id]="workgroupId"
              [mode]="mode">
          </label-student>
          <match-student ng-switch-when="Match"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [component-state]="componentState"
              [workgroup-id]="workgroupId"
              [mode]="mode">
          </match-student>
          <multiple-choice-student ng-switch-when="MultipleChoice"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [component-state]="componentState"
              [workgroup-id]="workgroupId"
              [mode]="mode">
          </multiple-choice-student>
          <open-response-student ng-switch-when="OpenResponse"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [component-state]="componentState"
              [workgroup-id]="workgroupId"
              [mode]="mode">
          </open-response-student>
          <outside-url-student ng-switch-when="OutsideURL"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </outside-url-student>
          <peer-chat-student ng-switch-when="PeerChat"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [component-state]="componentState"
              [workgroup-id]="workgroupId"
              [mode]="mode">
          </peer-chat-student>
          <show-work-student ng-switch-when="ShowWork"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [component-state]="componentState"
              [workgroup-id]="workgroupId"
              [mode]="mode">
          </show-work-student>
          <summary-student ng-switch-when="Summary"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [component-state]="componentState"
              [workgroup-id]="workgroupId"
              [mode]="mode">
          </summary-student>
          <table-student ng-switch-when="Table"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [component-state]="componentState"
              [workgroup-id]="workgroupId"
              [mode]="mode">
          </table-student>
        </div>`
};

export default Component;
