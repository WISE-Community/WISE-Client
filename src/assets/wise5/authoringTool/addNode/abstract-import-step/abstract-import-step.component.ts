import { Directive, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../../services/configService';
import { CopyNodesService } from '../../../services/copyNodesService';
import { InsertNodesService } from '../../../services/insertNodesService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { InsertFirstNodeInBranchPathService } from '../../../services/insertFirstNodeInBranchPathService';

@Directive()
export abstract class AbstractImportStepComponent implements OnInit {
  protected importProjectId: number;
  protected nextId: string;
  protected targetId: string;

  constructor(
    protected configService: ConfigService,
    protected copyNodesService: CopyNodesService,
    protected insertFirstNodeInBranchPathService: InsertFirstNodeInBranchPathService,
    protected insertNodesService: InsertNodesService,
    protected projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.targetId = history.state.targetId;
    this.nextId = history.state.nextId;
    this.importProjectId = history.state.importProjectId;
  }

  protected import(nodesToImport: any[]): void {
    this.copyNodesService
      .copyNodes(nodesToImport, this.importProjectId, this.configService.getProjectId())
      .subscribe((copiedNodes: any[]) => {
        const nodesWithNewNodeIds = this.projectService.getNodesWithNewIds(copiedNodes);
        if (this.projectService.isFirstNodeInBranchPath(this.nextId)) {
          this.insertFirstNodeInBranchPathService.insertNodes(
            nodesWithNewNodeIds,
            this.targetId,
            this.nextId
          );
        } else {
          this.insertNodesService.insertNodes(nodesWithNewNodeIds, this.targetId);
        }
        this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
          this.projectService.refreshProject();
          this.router.navigate(['../../..'], { relativeTo: this.route });
        });
      });
  }
}
