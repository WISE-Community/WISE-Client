import { Component } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { ConfigService } from '../../../../assets/wise5/services/configService';
import { CopyNodesService } from '../../../../assets/wise5/services/copyNodesService';
import { InsertNodesService } from '../../../../assets/wise5/services/insertNodesService';
import { TeacherProjectService } from '../../../../assets/wise5/services/teacherProjectService';

@Component({
  styleUrls: ['choose-import-step-location.component.scss'],
  templateUrl: 'choose-import-step-location.component.html'
})
export class ChooseImportStepLocationComponent {
  nodeIds: string[];

  constructor(
    private upgrade: UpgradeModule,
    private ConfigService: ConfigService,
    private CopyNodesService: CopyNodesService,
    private InsertNodesService: InsertNodesService,
    private ProjectService: TeacherProjectService
  ) {
    this.nodeIds = Object.keys(this.ProjectService.idToOrder);
    this.nodeIds.shift(); // remove the 'group0' master root node from consideration
  }

  importSelectedNodes(nodeIdToInsertInsideOrAfter: string) {
    this.CopyNodesService.copyNodes(
      this.upgrade.$injector.get('$stateParams').selectedNodes,
      this.upgrade.$injector.get('$stateParams').importFromProjectId,
      this.ConfigService.getProjectId()
    ).subscribe((copiedNodes: any[]) => {
      const nodesWithNewNodeIds = this.ProjectService.getNodesWithNewIds(copiedNodes);
      this.InsertNodesService.insertNodes(nodesWithNewNodeIds, nodeIdToInsertInsideOrAfter);
      this.ProjectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
        this.ProjectService.refreshProject();
        if (nodesWithNewNodeIds.length === 1) {
          this.upgrade.$injector
            .get('$state')
            .go('root.at.project.node', { nodeId: nodesWithNewNodeIds[0].id });
        } else {
          this.upgrade.$injector.get('$state').go('root.at.project');
        }
      });
    });
  }

  isGroupNode(nodeId) {
    return this.ProjectService.isGroupNode(nodeId);
  }

  getNodeTitle(nodeId: string): string {
    return this.ProjectService.getNodeTitle(nodeId);
  }

  getNodePositionById(nodeId) {
    return this.ProjectService.getNodePositionById(nodeId);
  }

  isNodeInAnyBranchPath(nodeId) {
    return this.ProjectService.isNodeInAnyBranchPath(nodeId);
  }

  cancel() {
    this.upgrade.$injector.get('$state').go('root.at.project');
  }
}
