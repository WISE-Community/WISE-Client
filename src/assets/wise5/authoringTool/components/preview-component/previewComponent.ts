import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';

class PreviewComponentController {
  componentContent: any;
  componentId: string;
  isDirty: boolean;
  nodeId: string;
  updateInterval: any;

  static $inject = ['$scope', '$compile', '$element', 'NodeService', 'ProjectService'];

  constructor(
    private $scope: any,
    private $compile: any,
    private $element: any,
    private NodeService: NodeService,
    private ProjectService: ProjectService
  ) {}

  $onInit() {
    this.$scope.mode = 'authoringComponentPreview';
    this.$scope.componentTemplatePath = this.NodeService.getComponentTemplatePath(
      this.componentContent.type
    );
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
          <div ng-switch-when="AudioOscillator|ConceptMap|Draw|HTML|Label|Match|MultipleChoice|OutsideURL" ng-switch-when-separator="|">
            <audio-oscillator-student ng-if="type === 'AudioOscillator'"
                [node-id]="nodeId"
                [component-content]="componentContent"
                [mode]="mode">
            </audio-oscillator-student>
            <concept-map-student ng-if="type === 'ConceptMap'"
                [node-id]="nodeId"
                [component-content]="componentContent"
                [mode]="mode">
            </concept-map-student>
            <draw-student ng-if="type === 'Draw'"
                [node-id]="nodeId"
                [component-content]="componentContent"
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
                [mode]="mode">
            </label-student>
            <match-student ng-if="type === 'Match'"
                [node-id]="nodeId"
                [component-content]="componentContent"
                [mode]="mode">
            </match-student>
            <multiple-choice-student ng-if="type === 'MultipleChoice'"
                [node-id]="nodeId"
                [component-content]="componentContent"
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
