import { Directive, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../../services/configService';
import { CopyNodesService } from '../../../services/copyNodesService';
import { InsertNodesService } from '../../../services/insertNodesService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { InsertFirstNodeInBranchPathService } from '../../../services/insertFirstNodeInBranchPathService';
import { AddStepTarget } from '../../../../../app/domain/addStepTarget';
import { ensureDefaultIcon } from '../../../common/Node';

@Directive()
export abstract class AbstractImportStepComponent implements OnInit {
  protected importProjectId: number;
  protected submitting: boolean;
  protected target: AddStepTarget;

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
    this.target = history.state;
    this.importProjectId = this.target.importProjectId;
  }

  protected import(nodesToImport: any[]): void {
    this.submitting = true;
    this.copyNodesService
      .copyNodes(nodesToImport, this.importProjectId, this.configService.getProjectId())
      .subscribe((copiedNodesWithOldIds: any[]) => {
        const copiedNodes = this.replaceNodesWithNewIds(copiedNodesWithOldIds);
        ensureDefaultIcon(copiedNodes);
        if (this.target.type === 'firstStepInBranchPath') {
          this.insertFirstNodeInBranchPathService.insertNodes(
            copiedNodes,
            this.target.branchNodeId,
            this.target.firstNodeIdInBranchPath
          );
        } else {
          this.setColor(copiedNodes, this.target.targetId);
          this.insertNodesService.insertNodes(copiedNodes, this.target.targetId);
        }
        this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
          this.projectService.refreshProject();
          this.router.navigate(['../../..'], { relativeTo: this.route });
        });
      });
  }

  private replaceNodesWithNewIds(nodes: any[]): any[] {
    const oldToNewIds = this.projectService.getOldToNewIds(nodes);
    return nodes.map((node: any) => this.projectService.replaceOldIds(node, oldToNewIds));
  }

  private setColor(nodes: any[], nodeId: string): void {
    const nodeToMatchColor = this.projectService.isGroupNode(nodeId)
      ? this.projectService.getNodeById(nodeId)
      : this.projectService.getParentGroup(nodeId);
    ensureDefaultIcon([nodeToMatchColor]);
    nodes.forEach((node: any) => (node.icon.color = nodeToMatchColor.icon.color));
  }
}
