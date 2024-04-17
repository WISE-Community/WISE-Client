import { Directive, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../../services/configService';
import { CopyNodesService } from '../../../services/copyNodesService';
import { InsertNodesService } from '../../../services/insertNodesService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Directive()
export abstract class AbstractImportStepComponent implements OnInit {
  protected importProjectId: number;
  protected targetLocation: string;

  constructor(
    protected configService: ConfigService,
    protected copyNodesService: CopyNodesService,
    protected insertNodesService: InsertNodesService,
    protected projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.targetLocation = history.state.targetLocation;
    this.importProjectId = history.state.importProjectId;
  }

  protected import(nodesToImport: any[]): void {
    this.copyNodesService
      .copyNodes(nodesToImport, this.importProjectId, this.configService.getProjectId())
      .subscribe((copiedNodes: any[]) => {
        const nodesWithNewNodeIds = this.projectService.getNodesWithNewIds(copiedNodes);
        this.insertNodesService.insertNodes(nodesWithNewNodeIds, this.targetLocation);
        this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
          this.projectService.refreshProject();
          this.router.navigate(['../../..'], { relativeTo: this.route });
        });
      });
  }
}
