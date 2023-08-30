import { Injectable } from '@angular/core';
import { TeacherProjectService } from './teacherProjectService';

@Injectable()
export class MoveNodesService {
  constructor(protected projectService: TeacherProjectService) {}

  /**
   * Move nodes inside an active/inactive group node
   * @param nodeIds the node ids to move
   * @param groupNodeId the node id of the group we are moving the nodes inside
   */
  moveNodesInsideGroup(nodeIds: string[], groupNodeId: string): any[] {
    const movedNodes = [];
    for (let n = 0; n < nodeIds.length; n++) {
      const nodeId = nodeIds[n];
      const node = this.projectService.getNodeById(nodeId);
      movedNodes.push(node);
      const movingNodeIsActive = this.projectService.isActive(nodeId);
      const stationaryNodeIsActive = this.projectService.isActive(groupNodeId);

      if (movingNodeIsActive && stationaryNodeIsActive) {
        this.projectService.removeNodeIdFromTransitions(nodeId);
        this.projectService.removeNodeIdFromGroups(nodeId);

        if (n == 0) {
          this.projectService.insertNodeInsideOnlyUpdateTransitions(nodeId, groupNodeId);
          this.projectService.insertNodeInsideInGroups(nodeId, groupNodeId);
        } else {
          this.projectService.insertNodeAfterInTransitions(node, groupNodeId);
          this.projectService.insertNodeAfterInGroups(nodeId, groupNodeId);
        }
      } else if (movingNodeIsActive && !stationaryNodeIsActive) {
        this.projectService.removeNodeIdFromTransitions(nodeId);
        this.projectService.removeNodeIdFromGroups(nodeId);

        if (n == 0) {
          this.projectService.moveFromActiveToInactiveInsertInside(node, groupNodeId);
        } else {
          this.projectService.moveToInactive(node, groupNodeId);
        }
      } else if (!movingNodeIsActive && stationaryNodeIsActive) {
        this.projectService.moveToActive(node);

        if (n == 0) {
          this.projectService.insertNodeInsideOnlyUpdateTransitions(nodeId, groupNodeId);
          this.projectService.insertNodeInsideInGroups(nodeId, groupNodeId);
        } else {
          this.projectService.insertNodeAfterInTransitions(node, groupNodeId);
          this.projectService.insertNodeAfterInGroups(nodeId, groupNodeId);
        }
      } else if (!movingNodeIsActive && !stationaryNodeIsActive) {
        this.projectService.removeNodeIdFromTransitions(nodeId);
        this.projectService.removeNodeIdFromGroups(nodeId);

        if (n == 0) {
          this.projectService.moveFromInactiveToInactiveInsertInside(node, groupNodeId);
        } else {
          this.moveInactiveNodeToInactiveSection(node, groupNodeId);
        }
      }
      // remember the node id so we can put the next node (if any) after this one
      groupNodeId = node.id;
    }
    return movedNodes;
  }

  /**
   * Move nodes after a certain node id
   * @param nodeIds the node ids to move
   * @param moveAfterNodeId the node id we will put the moved nodes after
   */
  moveNodesAfter(nodeIds: string[], moveAfterNodeId: string): any[] {
    const movedNodes = [];
    for (let nodeId of nodeIds) {
      const node = this.projectService.getNodeById(nodeId);
      movedNodes.push(node);
      const movingNodeIsActive = this.projectService.isActive(nodeId);
      const stationaryNodeIsActive = this.projectService.isActive(moveAfterNodeId);
      if (movingNodeIsActive && stationaryNodeIsActive) {
        this.projectService.removeNodeIdFromTransitions(nodeId);
        this.projectService.removeNodeIdFromGroups(nodeId);
        this.projectService.insertNodeAfterInGroups(nodeId, moveAfterNodeId);
        this.projectService.insertNodeAfterInTransitions(node, moveAfterNodeId);
      } else if (movingNodeIsActive && !stationaryNodeIsActive) {
        this.projectService.removeNodeIdFromTransitions(nodeId);
        this.projectService.removeNodeIdFromGroups(nodeId);
        this.projectService.moveToInactive(node, moveAfterNodeId);
      } else if (!movingNodeIsActive && stationaryNodeIsActive) {
        this.projectService.moveToActive(node);
        this.projectService.insertNodeAfterInGroups(nodeId, moveAfterNodeId);
        this.projectService.insertNodeAfterInTransitions(node, moveAfterNodeId);
      } else if (!movingNodeIsActive && !stationaryNodeIsActive) {
        this.projectService.removeNodeIdFromTransitions(nodeId);
        this.projectService.removeNodeIdFromGroups(nodeId);
        this.moveInactiveNodeToInactiveSection(node, moveAfterNodeId);
      }
      // remember the node id so we can put the next node (if any) after this one
      moveAfterNodeId = node.id;
    }
    return movedNodes;
  }

  private moveInactiveNodeToInactiveSection(node: any, nodeIdToInsertAfter: string): void {
    this.projectService.removeNodeFromInactiveNodes(node.id);
    this.projectService.addInactiveNodeInsertAfter(node, nodeIdToInsertAfter);
  }
}
