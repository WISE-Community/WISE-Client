import ConfigureStructureController from '../../structure/configureStructureController';
import { TeacherProjectService } from '../../../services/teacherProjectService';

export default class AutomatedAssessmentChooseItemController extends ConfigureStructureController {
  automatedAssessmentProjectId: number;
  items = [];
  project: any;
  node: string;
  projectIdToOrder: any;
  projectItems: any;

  static $inject = [
    '$filter',
    '$http',
    '$rootScope',
    '$state',
    '$stateParams',
    '$scope',
    'ProjectService'
  ];

  constructor(
    $filter,
    $http,
    $rootScope,
    $state,
    $stateParams,
    $scope,
    private ProjectService: TeacherProjectService
  ) {
    super($filter, $http, $rootScope, $state, $stateParams, $scope);
  }

  $onInit() {
    this.automatedAssessmentProjectId = this.ProjectService.getAutomatedAssessmentProjectId();
    this.showAutomatedAssessmentProject();
  }

  showAutomatedAssessmentProject() {
    this.ProjectService.retrieveProjectById(this.automatedAssessmentProjectId).then(
      (projectJSON) => {
        this.project = projectJSON;
        const nodeOrderOfProject = this.ProjectService.getNodeOrderOfProject(this.project);
        this.projectIdToOrder = nodeOrderOfProject.idToOrder;
        this.projectItems = nodeOrderOfProject.nodes;
      }
    );
  }

  previewNode(node) {
    window.open(`${this.project.previewProjectURL}/${node.id}`);
  }

  back() {
    this.$state.go('root.at.project.add-node.choose-template');
  }

  next() {
    this.$state.go('root.at.project.add-node.automated-assessment.configure', {
      importFromProjectId: this.automatedAssessmentProjectId,
      node: this.node
    });
  }
}
