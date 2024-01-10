import { Component } from '@angular/core';
import { TeacherProjectService } from '../../../../assets/wise5/services/teacherProjectService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'choose-import-step',
  styleUrls: ['choose-import-step.component.scss', '../../add-content.scss'],
  templateUrl: 'choose-import-step.component.html'
})
export class ChooseImportStepComponent {
  protected project: any;
  private projectId: number;
  protected projectIdToOrder: any;
  private projectItems: any[] = [];

  constructor(
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.projectId = history.state.importProjectId;
    this.projectService.retrieveProjectById(this.projectId).then((projectJSON) => {
      this.project = projectJSON;
      const nodeOrderOfProject = this.projectService.getNodeOrderOfProject(this.project);
      this.projectIdToOrder = Object.values(nodeOrderOfProject.idToOrder);
      this.projectItems = nodeOrderOfProject.nodes;
    });
  }

  protected previewNode(node: any): void {
    window.open(`${this.project.previewProjectURL}/${node.id}`);
  }

  protected previewProject(): void {
    window.open(`${this.project.previewProjectURL}`);
  }

  protected goToChooseLocation(): void {
    this.router.navigate(['../choose-location'], {
      relativeTo: this.route,
      state: {
        importFromProjectId: this.projectId,
        selectedNodes: this.getSelectedNodesToImport()
      }
    });
  }

  protected getSelectedNodesToImport(): any[] {
    return this.projectItems.filter((item) => item.checked).map((item) => item.node);
  }
}
