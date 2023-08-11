import { Component } from '@angular/core';
import { ConfigureStructureComponent } from '../../structure/configure-structure.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { HttpClient } from '@angular/common/http';
import { UpgradeModule } from '@angular/upgrade/static';

class SimulationNode {
  metadata = {
    subjects: []
  };
  type: string;
  constructor(node: any) {
    Object.assign(this, node);
  }
}

@Component({
  selector: 'choose-simulation',
  templateUrl: './choose-simulation.component.html',
  styleUrls: ['./choose-simulation.component.scss']
})
export class ChooseSimulationComponent extends ConfigureStructureComponent {
  allNodes: SimulationNode[] = [];
  filteredNodes: SimulationNode[] = [];
  project: any;
  projectItems: any;
  searchText: string = '';
  selectedNode: string;
  selectedSubjects: string[] = [];
  simulationProjectId: number;
  subjects: string[] = [];

  constructor(
    http: HttpClient,
    private projectService: TeacherProjectService,
    protected upgrade: UpgradeModule
  ) {
    super(http, upgrade);
  }

  ngOnInit(): void {
    this.$state = this.upgrade.$injector.get('$state');
    this.simulationProjectId = this.projectService.getSimulationProjectId();
    this.showSimulationProject();
  }

  private showSimulationProject(): void {
    this.projectService.retrieveProjectById(this.simulationProjectId).then((projectJSON) => {
      this.project = projectJSON;
      const nodeOrderOfProject = this.projectService.getNodeOrderOfProject(this.project);
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

  protected filter(): void {
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

  protected clearFilters(): void {
    this.searchText = '';
    this.selectedSubjects = [];
    this.filter();
  }

  protected getNumItemsFound(): number {
    return this.filteredNodes.filter((node: SimulationNode) => {
      return node.type != 'group';
    }).length;
  }

  protected previewNode(node: any): void {
    window.open(`${this.project.previewProjectURL}/${node.id}`);
  }

  protected back(): void {
    this.$state.go('root.at.project.add-node.choose-template');
  }

  protected next(): void {
    this.$state.go('root.at.project.import-step.choose-location', {
      importFromProjectId: this.simulationProjectId,
      selectedNodes: [this.selectedNode]
    });
  }

  protected itemSelected(item: any): void {
    this.selectedNode = item;
  }
}
