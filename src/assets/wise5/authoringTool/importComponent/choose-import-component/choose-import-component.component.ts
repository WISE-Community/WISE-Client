import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConfigService } from '../../../services/configService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { ProjectLibraryService } from '../../../services/projectLibraryService';
import { Component, OnInit } from '@angular/core';
import { ImportComponentService } from '../../../services/importComponentService';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'choose-import-component',
  templateUrl: './choose-import-component.component.html',
  styleUrls: ['./choose-import-component.component.scss']
})
export class ChooseImportComponentComponent implements OnInit {
  importLibraryProjectId: number;
  importMyProjectId: number;
  protected importProject: any = null;
  importProjectId: number;
  importProjectItems: any = [];
  protected libraryProjectsList: any = [];
  protected myProjectsList: any = [];
  nodesInOrder: any[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private importComponentService: ImportComponentService,
    private projectAssetService: ProjectAssetService,
    private projectLibraryService: ProjectLibraryService,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.importProjectItems = [];
    this.importMyProjectId = null;
    this.importLibraryProjectId = null;
    this.importProjectId = null;
    this.importProject = null;
    this.myProjectsList = this.configService.getAuthorableProjects();
    this.subscriptions.add(
      this.projectLibraryService.getLibraryProjects().subscribe((libraryProjects) => {
        this.libraryProjectsList = libraryProjects;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
      this.importComponentService
        .importComponents(
          selectedComponents,
          this.importProjectId,
          this.dataService.getCurrentNodeId(),
          history.state.insertAfterComponentId
        )
        .subscribe((newComponents) => {
          this.projectService.saveProject();
          // refresh the project assets in case any of the imported components also imported assets
          this.projectAssetService.retrieveProjectAssets();
          this.router.navigate(['../..'], {
            relativeTo: this.route,
            state: {
              projectId: this.configService.getProjectId(),
              nodeId: this.dataService.getCurrentNodeId(),
              newComponents: newComponents
            }
          });
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

  protected previewImportProject(): void {
    window.open(`${this.importProject.previewProjectURL}`);
  }

  protected previewImportNode(node: any): void {
    window.open(`${this.importProject.previewProjectURL}/${node.id}`);
  }

  protected cancel(): void {
    this.router.navigate(['../..'], {
      relativeTo: this.route,
      state: {
        projectId: this.configService.getProjectId(),
        nodeId: this.dataService.getCurrentNodeId()
      }
    });
  }
}
