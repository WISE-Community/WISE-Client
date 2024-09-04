import { Injectable } from '@angular/core';
import { TeacherProjectService } from './teacherProjectService';
import { RemoveNodeIdFromTransitionsService } from './removeNodeIdFromTransitionsService';

@Injectable()
export class DeleteNodeService {
  constructor(
    protected ProjectService: TeacherProjectService,
    private removeNodeIdFromTransitionsService: RemoveNodeIdFromTransitionsService
  ) {}

  /**
   * Delete a node from the project and update transitions.
   * If we are deleting the project start node id, we will need to change it to the
   * next logical node id that will be used as the project start.
   *
   * @param nodeId the node id to delete from the project. It can be a step or an activity.
   */
  deleteNode(nodeId: string): void {
    const parentGroup = this.ProjectService.getParentGroup(nodeId);
    if (parentGroup != null && parentGroup.startId === nodeId) {
      this.setGroupStartIdToNextChildId(parentGroup);
    }
    if (this.isProjectStartNodeIdOrContainsProjectStartNodeId(nodeId)) {
      this.updateProjectStartNodeIdToNextLogicalNode(nodeId);
    }
    if (this.ProjectService.isGroupNode(nodeId)) {
      this.removeChildNodes(nodeId);
    }
    this.removeNodeIdFromTransitionsService.remove(nodeId);
    this.ProjectService.removeNodeIdFromGroups(nodeId);
    this.removeNodeIdFromNodes(nodeId);
  }

  private setGroupStartIdToNextChildId(group: any): void {
    let hasSetNewStartId = false;
    const transitions = this.ProjectService.getTransitionsByFromNodeId(group.startId);
    if (transitions.length > 0) {
      const transition = transitions[0];
      const toNodeId = transition.to;
      if (this.ProjectService.isNodeInGroup(toNodeId, group.id)) {
        group.startId = toNodeId;
        hasSetNewStartId = true;
      }
    }
    if (!hasSetNewStartId) {
      group.startId = '';
    }
  }

  private isProjectStartNodeIdOrContainsProjectStartNodeId(nodeId: string): boolean {
    return (
      this.ProjectService.getStartNodeId() === nodeId ||
      (this.ProjectService.isGroupNode(nodeId) && this.containsStartNodeId(nodeId))
    );
  }

  private containsStartNodeId(groupId: string): boolean {
    const group = this.ProjectService.getNodeById(groupId);
    const projectStartNodeId = this.ProjectService.getStartNodeId();
    for (let childId of group.ids) {
      if (childId === projectStartNodeId) {
        return true;
      }
    }
    return false;
  }

  private updateProjectStartNodeIdToNextLogicalNode(nodeId: string): void {
    if (this.ProjectService.isGroupNode(nodeId)) {
      this.updateProjectStartNodeIdToNextLogicalNodeForRemovingGroup(nodeId);
    } else {
      this.updateProjectStartNodeIdToNextLogicalNodeForRemovingStep(nodeId);
    }
  }

  /**
   * Set the startNodeId of the specified group to the first node of the next group.
   * If the next group doesn't have any nodes, startNodeId should point
   * to the next group.
   */
  private updateProjectStartNodeIdToNextLogicalNodeForRemovingGroup(nodeId: string): void {
    const transitions = this.ProjectService.getTransitionsByFromNodeId(nodeId);
    if (transitions.length == 0) {
      this.ProjectService.setStartNodeId('group0');
    } else {
      let nextNodeId = transitions[0].to;
      if (this.ProjectService.isGroupNode(nextNodeId)) {
        const nextGroupStartId = this.ProjectService.getGroupStartId(nextNodeId);
        if (nextGroupStartId == null || nextGroupStartId === '') {
          this.ProjectService.setStartNodeId(nextNodeId);
        } else {
          this.ProjectService.setStartNodeId(nextGroupStartId);
        }
      } else {
        this.ProjectService.setStartNodeId(nextNodeId);
      }
    }
  }

  /**
   * Set the startNodeId to the next node in the transitions.
   * If there are no transitions, set it to the parent group of the node.
   */
  private updateProjectStartNodeIdToNextLogicalNodeForRemovingStep(nodeId: string): void {
    const transitions = this.ProjectService.getTransitionsByFromNodeId(nodeId);
    const parentGroupId = this.ProjectService.getParentGroupId(nodeId);
    if (transitions.length == 0) {
      this.ProjectService.setStartNodeId(parentGroupId);
    } else {
      let nextNodeId = transitions[0].to;
      if (this.ProjectService.isNodeInGroup(nextNodeId, parentGroupId)) {
        this.ProjectService.setStartNodeId(nextNodeId);
      } else {
        this.ProjectService.setStartNodeId(this.ProjectService.getParentGroupId(nodeId));
      }
    }
  }

  private removeChildNodes(groupId: string): void {
    const group = this.ProjectService.getNodeById(groupId);
    for (let i = 0; i < group.ids.length; i++) {
      const childId = group.ids[i];
      this.removeNodeIdFromTransitionsService.remove(childId);
      this.ProjectService.removeNodeIdFromGroups(childId);
      this.removeNodeIdFromNodes(childId);
      i--; // so it won't skip the next element
    }
  }

  private removeNodeIdFromNodes(nodeId: string): void {
    const nodes = this.ProjectService.project.nodes;
    for (let n = 0; n < nodes.length; n++) {
      const node = nodes[n];
      if (node != null) {
        if (nodeId === node.id) {
          nodes.splice(n, 1);
        }
      }
    }
    const inactiveNodes = this.ProjectService.project.inactiveNodes;
    if (inactiveNodes != null) {
      for (let i = 0; i < inactiveNodes.length; i++) {
        const inactiveNode = inactiveNodes[i];
        if (inactiveNode != null) {
          if (nodeId === inactiveNode.id) {
            inactiveNodes.splice(i, 1);
          }
        }
      }
    }
    this.ProjectService.idToNode[nodeId] = null;
  }
}
