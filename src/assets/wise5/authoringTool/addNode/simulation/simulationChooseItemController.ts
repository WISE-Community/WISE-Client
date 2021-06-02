import { TeacherProjectService } from '../../../services/teacherProjectService';
import ConfigureStructureController from '../../structure/configureStructureController';

export default class SimulationChooseItemController extends ConfigureStructureController {
  project: any;
  projectItems: any;
  selectedNodeId: string;
  simulationProjectId: number;

  static $inject = [
    '$filter',
    '$http',
    '$rootScope',
    '$state',
    '$stateParams',
    '$scope',
    'UtilService',
    'ProjectService'
  ];

  constructor(
    $filter,
    $http,
    $rootScope,
    $state,
    $stateParams,
    $scope,
    UtilService,
    private ProjectService: TeacherProjectService
  ) {
    super($filter, $http, $rootScope, $state, $stateParams, $scope, UtilService);
  }

  $onInit(): void {
    this.simulationProjectId = this.ProjectService.getSimulationProjectId();
    this.showSimulationProject();
  }

  showSimulationProject(): void {
    this.ProjectService.retrieveProjectById(this.simulationProjectId).then((projectJSON) => {
      this.project = projectJSON;
      const nodeOrderOfProject = this.ProjectService.getNodeOrderOfProject(this.project);
      this.projectItems = nodeOrderOfProject.nodes;
    });
  }

  previewNode(node: any): void {
    window.open(`${this.project.previewProjectURL}/${node.id}`);
  }

  back(): void {
    this.$state.go('root.at.project.add-node.choose-template');
  }

  next(): void {
    this.$state.go('root.at.project.import-step.choose-location', {
      importFromProjectId: this.simulationProjectId,
      selectedNodes: [this.selectedNodeId]
    });
  }
}
