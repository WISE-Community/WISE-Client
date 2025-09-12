import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ConfigService } from '../../../services/configService';
import { ImportComponentService } from '../../../services/importComponentService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    RouterModule
  ],
  selector: 'choose-import-component',
  styleUrl: './choose-import-component.component.scss',
  templateUrl: './choose-import-component.component.html'
})
export class ChooseImportComponentComponent implements OnInit {
  protected importProject: any = null;
  private importProjectId: number;
  protected myProjectsList: any = [];
  protected project: any;
  protected projectIdToOrder: any;
  private projectItems: any[] = [];
  protected state: any;
  protected submitting: boolean;

  constructor(
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private importComponentService: ImportComponentService,
    private projectAssetService: ProjectAssetService,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.state = history.state;
    this.importProjectId = this.state.importProjectId;
    this.projectService.retrieveProjectById(this.importProjectId).then((projectJSON) => {
      this.project = projectJSON;
      const nodeOrderOfProject = this.projectService.getNodeOrderOfProject(this.project);
      this.projectIdToOrder = Object.values(nodeOrderOfProject.idToOrder)
        .slice(1)
        .filter((item: any) => item.node.components?.length > 0);
      this.projectItems = nodeOrderOfProject.nodes;
    });
  }

  protected previewProject(): void {
    window.open(`${this.project.previewProjectURL}`);
  }

  protected previewNode(node: any): void {
    window.open(`${this.project.previewProjectURL}/${node.id}`);
  }

  protected import(): void {
    this.importComponentService
      .importComponents(
        this.getSelectedComponentsToImport(),
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

  protected getSelectedComponentsToImport(): any[] {
    return this.projectItems
      .flatMap((item) => item.node.components)
      .filter((component) => component?.checked);
  }
}
