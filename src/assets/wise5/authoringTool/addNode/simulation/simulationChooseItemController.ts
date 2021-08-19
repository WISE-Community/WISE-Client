import { TeacherProjectService } from '../../../services/teacherProjectService';
import ConfigureStructureController from '../../structure/configureStructureController';

class SimulationNode {
  metadata = {
    subjects: []
  };
  type: string;
  constructor(node: any) {
    Object.assign(this, node);
  }
}

export default class SimulationChooseItemController extends ConfigureStructureController {
  allNodes: SimulationNode[] = [];
  filteredNodes: SimulationNode[] = [];
  project: any;
  projectItems: any;
  searchText: string = '';
  selectedNode: string;
  simulationProjectId: number;
  selectedSubjects: string[] = [];
  subjects: string[] = [];

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

  private showSimulationProject(): void {
    this.ProjectService.retrieveProjectById(this.simulationProjectId).then((projectJSON) => {
      this.project = projectJSON;
      const nodeOrderOfProject = this.ProjectService.getNodeOrderOfProject(this.project);
      this.projectItems = nodeOrderOfProject.nodes.slice(1); // remove root node from consideration
      const allSubjects: string[] = [];
      this.projectItems.forEach((item) => {
        if (item.node.type !== 'group') {
          const simulationNode = new SimulationNode(item.node);
          this.allNodes.push(simulationNode);
          allSubjects.push(...simulationNode.metadata.subjects);
        }
      });
      this.filteredNodes = this.allNodes;
      this.subjects = Array.from(new Set(allSubjects)).sort();
    });
  }

  filter(): void {
    this.filteredNodes = this.allNodes.filter((node: SimulationNode) => {
      const isSearchTextFound = this.isSearchTextFound(this.searchText, JSON.stringify(node));
      if (this.isAnySubjectChosen()) {
        return isSearchTextFound && this.isSubjectFound(this.selectedSubjects, node);
      }
      return isSearchTextFound;
    });
  }

  private isSearchTextFound(searchText: string, testText: string): boolean {
    return testText.toLowerCase().includes(searchText.toLowerCase());
  }

  private isAnySubjectChosen(): boolean {
    return this.selectedSubjects.length > 0;
  }

  private isSubjectFound(selectedSubjects: any[], resource: any): boolean {
    for (const subject of selectedSubjects) {
      if (resource.metadata.subjects.includes(subject)) {
        return true;
      }
    }
    return false;
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedSubjects = [];
    this.filter();
  }

  getNumItemsFound(): number {
    return this.filteredNodes.filter((node: SimulationNode) => {
      return node.type != 'group';
    }).length;
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
      selectedNodes: [this.selectedNode]
    });
  }

  itemSelected(item: any) {
    this.selectedNode = item;
  }
}
