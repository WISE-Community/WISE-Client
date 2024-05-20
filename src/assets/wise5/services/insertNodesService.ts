import { Injectable } from '@angular/core';
import { TeacherProjectService } from './teacherProjectService';
import { CreateNodeBetweenService } from './createNodeBetweenService';

@Injectable()
export class InsertNodesService {
  constructor(
    private createNodeBetweenService: CreateNodeBetweenService,
    private projectService: TeacherProjectService
  ) {}

  /**
   * Insert nodes in specified location. Modifies project.
   * @param nodes nodes to insert
   * @param targetId id of node or group. If this is a group, we will make the
   * new step the first step in the group. If this is a step, we will place the new step after it.
   */
  insertNodes(nodes: any[], targetId: string, nextId: string): void {
    if (targetId == null) {
      /*
       * Insert the node after the last inactive node. If there
       * are no inactive nodes it will just be placed in the
       * inactive nodes section. In the latter case we do this by
       * setting targetId to 'inactiveSteps'.
       */
      const inactiveNodes = this.projectService.getInactiveNodes();
      if (inactiveNodes != null && inactiveNodes.length > 0) {
        targetId = inactiveNodes[inactiveNodes.length - 1];
      } else {
        targetId = 'inactiveSteps';
      }
    }

    for (const node of nodes) {
      if (this.projectService.isGroupNode(targetId)) {
        this.projectService.createNodeInside(node, targetId);
      } else if (this.projectService.isFirstNodeInBranchPath(nextId)) {
        this.createNodeBetweenService.createNodeBetween(node, targetId, nextId);
      } else {
        this.projectService.createNodeAfter(node, targetId);
      }

      /*
       * Update the targetId so that when we are
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
       * targetId to be nodeA so that when we add
       * nodeB, it will be placed after nodeA.
       */
      targetId = node.id;
    }
  }
}
