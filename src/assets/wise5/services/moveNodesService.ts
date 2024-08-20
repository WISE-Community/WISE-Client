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
          this.moveFromActiveToInactiveInsertInside(node, groupNodeId);
        } else {
          this.moveToInactive(node, groupNodeId);
        }
      } else if (!movingNodeIsActive && stationaryNodeIsActive) {
        this.moveToActive(node);

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
          this.moveFromInactiveToInactiveInsertInside(node, groupNodeId);
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
   * Move the node from active to inside an inactive group
   * @param node the node to move
   * @param nodeIdToInsertInside place the node inside this
   */
  private moveFromActiveToInactiveInsertInside(node: any, nodeIdToInsertInside: string): void {
    this.removeNodeFromActiveNodes(node.id);
    this.projectService.addInactiveNodeInsertInside(node, nodeIdToInsertInside);
  }

  /**
   * Remove the node from the active nodes.
   * If the node is a group node, also remove its children.
   * @param nodeId the node to remove
   * @returns the node that was removed
   */
  private removeNodeFromActiveNodes(nodeId: string): any {
    let nodeRemoved = null;
    const activeNodes = this.projectService.project.nodes;
    for (let a = 0; a < activeNodes.length; a++) {
      const activeNode = activeNodes[a];
      if (activeNode.id === nodeId) {
        activeNodes.splice(a, 1);
        nodeRemoved = activeNode;
        if (activeNode.type === 'group') {
          this.removeChildNodesFromActiveNodes(activeNode);
        }
        break;
      }
    }
    return nodeRemoved;
  }

  /**
   * Move the child nodes of a group from the active nodes.
   * @param node The group node.
   */
  private removeChildNodesFromActiveNodes(node: any): void {
    for (const childId of node.ids) {
      this.removeNodeFromActiveNodes(childId);
    }
  }

  /**
   * Move the node to the active nodes array. If the node is a group node,
   * also move all of its children to active.
   */
  private moveToActive(node: any): void {
    this.projectService.removeNodeFromInactiveNodes(node.id);
    this.projectService.addNode(node);
    if (this.projectService.isGroupNode(node.id)) {
      for (const childId of node.ids) {
        this.projectService.addNode(this.projectService.removeNodeFromInactiveNodes(childId));
      }
    }
  }

  /**
   * Move the node from inactive to inside an inactive group
   * @param node the node to move
   * @param nodeIdToInsertInside place the node inside this
   */
  private moveFromInactiveToInactiveInsertInside(node: any, nodeIdToInsertInside: string): void {
    this.projectService.removeNodeFromInactiveNodes(node.id);
    if (this.projectService.isGroupNode(node.id)) {
      /*
       * remove the group's child nodes from our data structures so that we can
       * add them back in later
       */
      for (const childId of node.ids) {
        const childNode = this.projectService.getNodeById(childId);
        const inactiveNodesIndex = this.projectService.project.inactiveNodes.indexOf(childNode);
        if (inactiveNodesIndex != -1) {
          this.projectService.project.inactiveNodes.splice(inactiveNodesIndex, 1);
        }
        const inactiveStepNodesIndex = this.projectService.inactiveStepNodes.indexOf(childNode);
        if (inactiveStepNodesIndex != -1) {
          this.projectService.inactiveStepNodes.splice(inactiveStepNodesIndex, 1);
        }
      }
    }
    this.projectService.addInactiveNodeInsertInside(node, nodeIdToInsertInside);
  }

  /**
   * Move an active node to the inactive nodes array.
   * @param node the node to move
   * @param nodeIdToInsertAfter place the node after this
   */
  private moveToInactive(node: any, nodeIdToInsertAfter: string): void {
    this.removeNodeFromActiveNodes(node.id);
    this.projectService.addInactiveNodeInsertAfter(node, nodeIdToInsertAfter);
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
        this.moveToInactive(node, moveAfterNodeId);
      } else if (!movingNodeIsActive && stationaryNodeIsActive) {
        this.moveToActive(node);
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
