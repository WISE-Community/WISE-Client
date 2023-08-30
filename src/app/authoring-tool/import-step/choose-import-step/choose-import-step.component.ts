import { Component } from '@angular/core';
import { ConfigService } from '../../../../assets/wise5/services/configService';
import { ProjectLibraryService } from '../../../../assets/wise5/services/projectLibraryService';
import { TeacherProjectService } from '../../../../assets/wise5/services/teacherProjectService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'choose-import-step',
  styleUrls: ['choose-import-step.component.scss'],
  templateUrl: 'choose-import-step.component.html'
})
export class ChooseImportStepComponent {
  protected importLibraryProjectId: number;
  protected importMyProjectId: number;
  protected importProject: any;
  private importProjectId: number;
  protected importProjectIdToOrder: any;
  private importProjectItems: any[] = [];
  protected libraryProjectsList: any[];
  protected myProjectsList: any[];

  constructor(
    private configService: ConfigService,
    private projectLibraryService: ProjectLibraryService,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.myProjectsList = this.configService.getAuthorableProjects();
    this.projectLibraryService.getLibraryProjects().then((libraryProjects) => {
      this.libraryProjectsList = this.projectLibraryService.sortAndFilterUniqueProjects(
        libraryProjects
      );
    });
  }

  protected showMyProject(): void {
    this.importLibraryProjectId = null;
    this.showProject(this.importMyProjectId);
  }

  protected showLibraryProject(): void {
    this.importMyProjectId = null;
    this.showProject(this.importLibraryProjectId);
  }

  private showProject(importProjectId: number): void {
    this.importProjectId = importProjectId;
    this.projectService.retrieveProjectById(this.importProjectId).then((projectJSON) => {
      this.importProject = projectJSON;
      const nodeOrderOfProject = this.projectService.getNodeOrderOfProject(this.importProject);
      this.importProjectIdToOrder = Object.values(nodeOrderOfProject.idToOrder);
      this.importProjectItems = nodeOrderOfProject.nodes;
    });
  }

  protected previewImportNode(node: any): void {
    window.open(`${this.importProject.previewProjectURL}/${node.id}`);
  }

  protected previewImportProject(): void {
    window.open(`${this.importProject.previewProjectURL}`);
  }

  protected importSteps(): void {
    this.router.navigate(['../choose-location'], {
      relativeTo: this.route,
      state: {
        importFromProjectId: this.importProjectId,
        selectedNodes: this.getSelectedNodesToImport()
      }
    });
  }

  protected getSelectedNodesToImport(): any[] {
    return this.importProjectItems.filter((item) => item.checked).map((item) => item.node);
  }
}
