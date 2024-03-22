import { Component } from '@angular/core';
import { TeacherProjectService } from '../../../../assets/wise5/services/teacherProjectService';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../../../assets/wise5/services/configService';
import { CopyNodesService } from '../../../../assets/wise5/services/copyNodesService';
import { InsertNodesService } from '../../../../assets/wise5/services/insertNodesService';
import { AbstractImportStepComponent } from '../../../../assets/wise5/authoringTool/addNode/abstract-import-step/abstract-import-step.component';

@Component({
  selector: 'choose-import-step',
  styleUrls: ['choose-import-step.component.scss', '../../add-content.scss'],
  templateUrl: 'choose-import-step.component.html'
})
export class ChooseImportStepComponent extends AbstractImportStepComponent {
  protected nodeIdToInsertInsideOrAfter: string;
  protected project: any;
  private projectId: number;
  protected projectIdToOrder: any;
  private projectItems: any[] = [];

  constructor(
    protected configService: ConfigService,
    protected copyNodesService: CopyNodesService,
    protected insertNodesService: InsertNodesService,
    protected projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(configService, copyNodesService, insertNodesService, projectService, route, router);
  }

  ngOnInit() {
    this.nodeIdToInsertInsideOrAfter = history.state.nodeIdToInsertInsideOrAfter;
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

  protected submit(): void {
    super.submit(this.getSelectedNodesToImport(), this.projectId, this.nodeIdToInsertInsideOrAfter);
  }

  protected getSelectedNodesToImport(): any[] {
    return this.projectItems.filter((item) => item.checked).map((item) => item.node);
  }
}
