import { Injectable } from '@angular/core';
import { TeacherProjectService } from './teacherProjectService';

@Injectable()
export class InsertNodesService {
  constructor(protected ProjectService: TeacherProjectService) {}

  /**
   * Insert nodes in specified location. Modifies project.
   * @param nodes nodes to insert
   * @param nodeIdToInsertInsideOrAfter id of node or group. If this is a group, we will make the
   * new step the first step in the group. If this is a step, we will place the new step after it.
   */
  insertNodes(nodes: any[], nodeIdToInsertInsideOrAfter: string) {
    if (nodeIdToInsertInsideOrAfter == null) {
      /*
       * Insert the node after the last inactive node. If there
       * are no inactive nodes it will just be placed in the
       * inactive nodes section. In the latter case we do this by
       * setting nodeIdToInsertInsideOrAfter to 'inactiveSteps'.
       */
      const inactiveNodes = this.ProjectService.getInactiveNodes();
      if (inactiveNodes != null && inactiveNodes.length > 0) {
        nodeIdToInsertInsideOrAfter = inactiveNodes[inactiveNodes.length - 1];
      } else {
        nodeIdToInsertInsideOrAfter = 'inactiveSteps';
      }
    }

    for (const node of nodes) {
      if (this.ProjectService.isGroupNode(nodeIdToInsertInsideOrAfter)) {
        this.ProjectService.createNodeInside(node, nodeIdToInsertInsideOrAfter);
      } else {
        this.ProjectService.createNodeAfter(node, nodeIdToInsertInsideOrAfter);
      }

      /*
       * Update the nodeIdToInsertInsideOrAfter so that when we are
       * importing multiple steps, the steps get placed in the correct
       * order.
       *
       * Example
       * We are importing nodeA and nodeB and want to place them after
       * nodeX. Therefore we want the order to be
       *
       * nodeX
       * nodeA
       * nodeB
       *
       * This means after we add nodeA, we must update
       * nodeIdToInsertInsideOrAfter to be nodeA so that when we add
       * nodeB, it will be placed after nodeA.
       */
      nodeIdToInsertInsideOrAfter = node.id;
    }
  }
}
