import { Injectable } from '@angular/core';
import { TeacherProjectService } from './teacherProjectService';

@Injectable()
export class MoveNodesService {
  constructor(protected ProjectService: TeacherProjectService) {}

  /**
   * Move nodes inside an active/inactive group node
   * @param nodeIds the node ids to move
   * @param groupNodeId the node id of the group we are moving the nodes inside
   */
  moveNodesInsideGroup(nodeIds: string[], groupNodeId: string): any[] {
    const movedNodes = [];
    for (let n = 0; n < nodeIds.length; n++) {
      const nodeId = nodeIds[n];
      const node = this.ProjectService.getNodeById(nodeId);
      movedNodes.push(node);
      const movingNodeIsActive = this.ProjectService.isActive(nodeId);
      const stationaryNodeIsActive = this.ProjectService.isActive(groupNodeId);

      if (movingNodeIsActive && stationaryNodeIsActive) {
        this.ProjectService.removeNodeIdFromTransitions(nodeId);
        this.ProjectService.removeNodeIdFromGroups(nodeId);

        if (n == 0) {
          this.ProjectService.insertNodeInsideOnlyUpdateTransitions(nodeId, groupNodeId);
          this.ProjectService.insertNodeInsideInGroups(nodeId, groupNodeId);
        } else {
          this.ProjectService.insertNodeAfterInTransitions(node, groupNodeId);
          this.ProjectService.insertNodeAfterInGroups(nodeId, groupNodeId);
        }
      } else if (movingNodeIsActive && !stationaryNodeIsActive) {
        this.ProjectService.removeNodeIdFromTransitions(nodeId);
        this.ProjectService.removeNodeIdFromGroups(nodeId);

        if (n == 0) {
          this.ProjectService.moveFromActiveToInactiveInsertInside(node, groupNodeId);
        } else {
          this.ProjectService.moveToInactive(node, groupNodeId);
        }
      } else if (!movingNodeIsActive && stationaryNodeIsActive) {
        this.ProjectService.moveToActive(node);

        if (n == 0) {
          this.ProjectService.insertNodeInsideOnlyUpdateTransitions(nodeId, groupNodeId);
          this.ProjectService.insertNodeInsideInGroups(nodeId, groupNodeId);
        } else {
          this.ProjectService.insertNodeAfterInTransitions(node, groupNodeId);
          this.ProjectService.insertNodeAfterInGroups(nodeId, groupNodeId);
        }
      } else if (!movingNodeIsActive && !stationaryNodeIsActive) {
        this.ProjectService.removeNodeIdFromTransitions(nodeId);
        this.ProjectService.removeNodeIdFromGroups(nodeId);

        if (n == 0) {
          this.ProjectService.moveFromInactiveToInactiveInsertInside(node, groupNodeId);
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
      const node = this.ProjectService.getNodeById(nodeId);
      movedNodes.push(node);
      const movingNodeIsActive = this.ProjectService.isActive(nodeId);
      const stationaryNodeIsActive = this.ProjectService.isActive(moveAfterNodeId);
      if (movingNodeIsActive && stationaryNodeIsActive) {
        this.ProjectService.removeNodeIdFromTransitions(nodeId);
        this.ProjectService.removeNodeIdFromGroups(nodeId);
        this.ProjectService.insertNodeAfterInGroups(nodeId, moveAfterNodeId);
        this.ProjectService.insertNodeAfterInTransitions(node, moveAfterNodeId);
      } else if (movingNodeIsActive && !stationaryNodeIsActive) {
        this.ProjectService.removeNodeIdFromTransitions(nodeId);
        this.ProjectService.removeNodeIdFromGroups(nodeId);
        this.ProjectService.moveToInactive(node, moveAfterNodeId);
      } else if (!movingNodeIsActive && stationaryNodeIsActive) {
        this.ProjectService.moveToActive(node);
        this.ProjectService.insertNodeAfterInGroups(nodeId, moveAfterNodeId);
        this.ProjectService.insertNodeAfterInTransitions(node, moveAfterNodeId);
      } else if (!movingNodeIsActive && !stationaryNodeIsActive) {
        this.ProjectService.removeNodeIdFromTransitions(nodeId);
        this.ProjectService.removeNodeIdFromGroups(nodeId);
        this.moveInactiveNodeToInactiveSection(node, moveAfterNodeId);
      }
      // remember the node id so we can put the next node (if any) after this one
      moveAfterNodeId = node.id;
    }
    return movedNodes;
  }

  private moveInactiveNodeToInactiveSection(node: any, nodeIdToInsertAfter: string): void {
    this.ProjectService.removeNodeFromInactiveNodes(node.id);
    this.ProjectService.addInactiveNodeInsertAfter(node, nodeIdToInsertAfter);
  }
}
