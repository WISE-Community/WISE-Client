import { ProjectService } from '../../../services/projectService';

class PreviewComponentController {
  componentContent: any;
  componentId: string;
  isDirty: boolean;
  nodeId: string;
  updateInterval: any;

  static $inject = ['$scope', '$compile', '$element', 'ProjectService'];

  constructor(
    private $scope: any,
    private $compile: any,
    private $element: any,
    private ProjectService: ProjectService
  ) {}

  $onInit() {
    this.$scope.mode = 'authoringComponentPreview';
    this.$scope.nodeId = this.nodeId;
    this.$scope.type = this.componentContent.type;
    this.compileComponent();
    this.$scope.$watch(
      () => {
        return this.componentContent;
      },
      () => {
        this.isDirty = true;
      },
      true
    );
    this.updateInterval = setInterval(() => {
      if (this.isDirty) {
        this.compileComponent();
        this.isDirty = false;
      }
    }, 3000);
  }

  $onDestroy() {
    clearInterval(this.updateInterval);
  }

  compileComponent() {
    this.$scope.componentContent = this.ProjectService.injectAssetPaths(this.componentContent);
    const componentHTML = `<div ng-switch="type" class="component__wrapper">
          <animation-student ng-switch-when="Animation"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </animation-student>
          <audio-oscillator-student ng-switch-when="AudioOscillator"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </audio-oscillator-student>
          <concept-map-student ng-switch-when="ConceptMap"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </concept-map-student>
          <dialog-guidance-student ng-switch-when="DialogGuidance"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </dialog-guidance-student>
          <discussion-student ng-switch-when="Discussion"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </discussion-student>
          <draw-student ng-switch-when="Draw"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </draw-student>
          <embedded-student ng-switch-when="Embedded"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </embedded-student>
          <graph-student ng-switch-when="Graph"
              [node-id]="nodeId"
              [component-content]="componentContent"
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
              [mode]="mode">
          </label-student>
          <match-student ng-switch-when="Match"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </match-student>
          <multiple-choice-student ng-switch-when="MultipleChoice"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </multiple-choice-student>
          <open-response-student ng-switch-when="OpenResponse"
              [node-id]="nodeId"
              [component-content]="componentContent">
          </open-response-student>
          <outside-url-student ng-switch-when="OutsideURL"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </outside-url-student>
          <peer-chat-student ng-switch-when="PeerChat"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </peer-chat-student>
          <show-group-work-student ng-switch-when="ShowGroupWork"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </show-group-work-student>
          <show-my-work-student ng-switch-when="ShowMyWork"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </show-my-work-student>
          <summary-student ng-switch-when="Summary"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </summary-student>
          <table-student ng-switch-when="Table"
              [node-id]="nodeId"
              [component-content]="componentContent"
              [mode]="mode">
          </table-student>
        </div>`;
    this.$element.html(componentHTML);
    this.$compile(this.$element.contents())(this.$scope);
  }
}

const PreviewComponent = {
  bindings: {
    componentContent: '<',
    componentId: '@',
    nodeId: '@'
  },
  scope: true,
  controller: PreviewComponentController
};

export default PreviewComponent;
