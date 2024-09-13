import { Injectable } from '@angular/core';
import { TeacherProjectService } from './teacherProjectService';

@Injectable()
export class InsertFirstNodeInBranchPathService {
  constructor(private projectService: TeacherProjectService) {}

  insertNode(newNode: any, nodeIdBefore: string, nodeIdAfter: string): void {
    if (this.projectService.isInactive(nodeIdBefore)) {
      this.projectService.setIdToNode(newNode.id, newNode);
      this.projectService.addInactiveNodeInsertAfter(newNode, nodeIdBefore);
    } else {
      this.projectService.addNode(newNode);
      this.projectService.setIdToNode(newNode.id, newNode);
      this.insertNodeBetweenInGroups(newNode.id, nodeIdAfter);
      this.insertNodeBetweenInTransitions(newNode, nodeIdBefore, nodeIdAfter);
    }
  }

  insertNodes(nodes: any[], targetId: string, firstNodeInBranchPath: string): void {
    for (const node of nodes) {
      if (this.projectService.isFirstNodeInBranchPath(firstNodeInBranchPath)) {
        this.insertNode(node, targetId, firstNodeInBranchPath);
      } else {
        this.projectService.createNodeAfter(node, targetId);
      }
      targetId = node.id;
    }
  }

  private insertNodeBetweenInGroups(newNodeId: string, nodeIdAfter: string): void {
    for (const group of this.projectService.getGroupNodes()) {
      this.insertNodeBeforeInGroup(group, newNodeId, nodeIdAfter);
    }
    for (const inactiveGroup of this.projectService.getInactiveGroupNodes()) {
      this.insertNodeBeforeInGroup(inactiveGroup, newNodeId, nodeIdAfter);
    }
  }

  private insertNodeBeforeInGroup(group: any, newNodeId: string, nodeIdAfter: string): boolean {
    const ids = group.ids;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (nodeIdAfter === id) {
        ids.splice(i, 0, newNodeId);
        return true;
      }
    }
    return false;
  }

  private insertNodeBetweenInTransitions(
    newNode: any,
    nodeIdBefore: string,
    nodeIdAfter: string
  ): void {
    const nodeBefore = this.projectService.getNodeById(nodeIdBefore);
    const nodeBeforeTransition = nodeBefore.transitionLogic.transitions.find(
      (transition: any) => transition.to === nodeIdAfter
    );
    nodeBeforeTransition.to = newNode.id;
    newNode.transitionLogic.transitions = [{ to: nodeIdAfter }];
    this.projectService.updateBranchPathTakenConstraints(newNode, nodeIdAfter);
    nodeBefore.transitionLogic.transitions;
    const branch = this.projectService.getBranchesByBranchStartPointNodeId(nodeIdBefore)[0];
    const path = branch.paths.find((path) => path[0] === newNode.id);
    for (const nodeInPath of path) {
      this.updateBranchPathTakenConstraintToNode(
        this.projectService.getNodeById(nodeInPath),
        newNode.id
      );
    }
  }

  private updateBranchPathTakenConstraintToNode(node: any, toNodeId: string): void {
    const constraints = node.constraints;
    for (const constraint of constraints) {
      for (const removalCriterion of constraint.removalCriteria) {
        if (removalCriterion.name === 'branchPathTaken') {
          removalCriterion.params.toNodeId = toNodeId;
        }
      }
    }
  }
}
