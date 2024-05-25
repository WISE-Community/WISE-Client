import { Directive, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../../services/configService';
import { CopyNodesService } from '../../../services/copyNodesService';
import { InsertNodesService } from '../../../services/insertNodesService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { InsertFirstNodeInBranchPathService } from '../../../services/insertFirstNodeInBranchPathService';

@Directive()
export abstract class AbstractImportStepComponent implements OnInit {
  protected branchNodeId: string;
  protected firstNodeIdInBranchPath: string;
  protected importProjectId: number;
  protected targetId: string;
  protected targetType: string;

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
    this.targetType = history.state.targetType;
    this.targetId = history.state.targetId;
    this.branchNodeId = history.state.branchNodeId;
    this.firstNodeIdInBranchPath = history.state.firstNodeIdInBranchPath;
    this.importProjectId = history.state.importProjectId;
  }

  protected import(nodesToImport: any[]): void {
    this.copyNodesService
      .copyNodes(nodesToImport, this.importProjectId, this.configService.getProjectId())
      .subscribe((copiedNodes: any[]) => {
        const nodesWithNewNodeIds = this.projectService.getNodesWithNewIds(copiedNodes);
        if (this.targetType === 'firstStepInBranchPath') {
          this.insertFirstNodeInBranchPathService.insertNodes(
            nodesWithNewNodeIds,
            this.branchNodeId,
            this.firstNodeIdInBranchPath
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
