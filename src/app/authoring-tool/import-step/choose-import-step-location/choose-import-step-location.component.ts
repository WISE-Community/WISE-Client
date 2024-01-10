import { Component } from '@angular/core';
import { ConfigService } from '../../../../assets/wise5/services/configService';
import { CopyNodesService } from '../../../../assets/wise5/services/copyNodesService';
import { InsertNodesService } from '../../../../assets/wise5/services/insertNodesService';
import { TeacherProjectService } from '../../../../assets/wise5/services/teacherProjectService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'choose-import-step-location',
  styleUrls: ['choose-import-step-location.component.scss', '../../add-content.scss'],
  templateUrl: 'choose-import-step-location.component.html'
})
export class ChooseImportStepLocationComponent {
  protected nodeIds: string[];

  constructor(
    private configService: ConfigService,
    private copyNodesService: CopyNodesService,
    private insertNodesService: InsertNodesService,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.nodeIds = Object.keys(this.projectService.idToOrder);
    this.nodeIds.shift(); // remove the 'group0' master root node from consideration
  }

  protected importSelectedNodes(nodeIdToInsertInsideOrAfter: string): void {
    this.copyNodesService
      .copyNodes(
        history.state.selectedNodes,
        history.state.importFromProjectId,
        this.configService.getProjectId()
      )
      .subscribe((copiedNodes: any[]) => {
        const nodesWithNewNodeIds = this.projectService.getNodesWithNewIds(copiedNodes);
        this.insertNodesService.insertNodes(nodesWithNewNodeIds, nodeIdToInsertInsideOrAfter);
        this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
          this.projectService.refreshProject();
          if (nodesWithNewNodeIds.length === 1) {
            const newNode = nodesWithNewNodeIds[0];
            this.router.navigate(['../../../node', newNode.id], {
              relativeTo: this.route,
              state: {
                newComponents: newNode.components
              }
            });
          } else {
            this.router.navigate(['../../..'], { relativeTo: this.route });
          }
        });
      });
  }

  protected isGroupNode(nodeId: string): boolean {
    return this.projectService.isGroupNode(nodeId);
  }

  protected getNodeTitle(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  protected getNodePositionById(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  protected isNodeInAnyBranchPath(nodeId: string): boolean {
    return this.projectService.isNodeInAnyBranchPath(nodeId);
  }
}
