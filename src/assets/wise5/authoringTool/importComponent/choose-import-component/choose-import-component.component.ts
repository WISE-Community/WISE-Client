import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConfigService } from '../../../services/configService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { ProjectLibraryService } from '../../../services/projectLibraryService';
import { Component, OnInit } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({
  selector: 'choose-import-component',
  templateUrl: './choose-import-component.component.html',
  styleUrls: ['./choose-import-component.component.scss']
})
export class ChooseImportComponentComponent implements OnInit {
  importLibraryProjectId: number;
  importMyProjectId: number;
  importProject: any = null;
  importProjectId: number;
  importProjectItems: any = [];
  libraryProjectsList: any = [];
  myProjectsList: any = [];
  nodesInOrder: any[] = [];

  constructor(
    private configService: ConfigService,
    private projectLibraryService: ProjectLibraryService,
    private projectService: TeacherProjectService,
    private dataService: TeacherDataService,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit() {
    this.importProjectItems = [];
    this.importMyProjectId = null;
    this.importLibraryProjectId = null;
    this.importProjectId = null;
    this.importProject = null;
    this.myProjectsList = this.configService.getAuthorableProjects();
    this.projectLibraryService.getLibraryProjects().then((libraryProjects) => {
      this.libraryProjectsList = this.projectLibraryService.sortAndFilterUniqueProjects(
        libraryProjects
      );
    });
  }

  showMyImportProject(importProjectId: number): void {
    this.importLibraryProjectId = null;
    this.showImportProject(importProjectId);
  }

  showLibraryImportProject(importProjectId: number): void {
    this.importMyProjectId = null;
    this.showImportProject(importProjectId);
  }

  private showImportProject(importProjectId: number): void {
    this.importProjectId = importProjectId;
    this.projectService.retrieveProjectById(this.importProjectId).then((projectJSON: any) => {
      this.importProject = projectJSON;
      const orderData = this.projectService.getNodeOrderOfProject(this.importProject);
      this.nodesInOrder = Object.values(orderData.idToOrder);
      this.importProjectItems = orderData.nodes.filter((nodeOrder: any) => {
        return nodeOrder.node.type !== 'group';
      });
    });
  }

  importComponents(): void {
    const selectedComponents = this.getSelectedComponentsToImport();
    if (selectedComponents.length === 0) {
      alert($localize`Please select a component to import.`);
    } else {
      this.upgrade.$injector
        .get('$state')
        .go('root.at.project.node.import-component.choose-location', {
          importFromProjectId: this.importProjectId,
          selectedComponents: selectedComponents
        });
    }
  }

  private getSelectedComponentsToImport(): any[] {
    const selectedComponents = [];
    for (const item of this.importProjectItems) {
      for (const component of item.node.components) {
        if (component.checked) {
          delete component.checked;
          selectedComponents.push(component);
        }
      }
    }
    return selectedComponents;
  }

  previewImportProject(): void {
    window.open(`${this.importProject.previewProjectURL}`);
  }

  previewImportNode(node: any): void {
    window.open(`${this.importProject.previewProjectURL}/${node.id}`);
  }

  protected goToChooseNewComponent(): void {
    this.upgrade.$injector
      .get('$state')
      .go(
        'root.at.project.node.add-component.choose-component',
        this.upgrade.$injector.get('$stateParams')
      );
  }

  cancel(): void {
    this.upgrade.$injector.get('$state').go('root.at.project.node', {
      projectId: this.configService.getProjectId(),
      nodeId: this.dataService.getCurrentNodeId()
    });
  }
}
