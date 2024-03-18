import { Component } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ActivatedRoute, Router } from '@angular/router';

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
  styleUrls: ['./choose-simulation.component.scss', '../../add-content.scss']
})
export class ChooseSimulationComponent {
  private allNodes: SimulationNode[] = [];
  protected filteredNodes: SimulationNode[] = [];
  protected project: any;
  private projectItems: any;
  protected searchText: string = '';
  protected selectedNode: string;
  protected selectedSubjects: string[] = [];
  private simulationProjectId: number;
  protected subjects: string[] = [];

  constructor(
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
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
    return selectedSubjects.some((subject) => resource.metadata.subjects.includes(subject));
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

  protected next(): void {
    this.router.navigate(['../../import-step/choose-location'], {
      relativeTo: this.route,
      state: {
        importFromProjectId: this.simulationProjectId,
        selectedNodes: [this.selectedNode]
      }
    });
  }

  protected itemSelected(item: any): void {
    this.selectedNode = item;
  }
}
