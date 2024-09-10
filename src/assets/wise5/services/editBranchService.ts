import { Injectable } from '@angular/core';
import { AuthorBranchService } from './authorBranchService';

@Injectable()
export class EditBranchService extends AuthorBranchService {
  addBranchPath(pathIndex: number, params: any): void {
    const branchStep = this.projectService.getNode(params.branchStepId);
    const mergeStep = this.projectService.getNode(params.mergeStepId);
    const newNodeId = this.projectService.getNextAvailableNodeId();
    this.createPathStep(params, branchStep, newNodeId, pathIndex);
    this.setPathStepTransitions([newNodeId], mergeStep.id);
    this.setBranchNodeTransitionLogic(branchStep, params.criteria);
    this.addNewNodeIdBeforeMergeStep(params.mergeStepId, newNodeId);
  }

  private addNewNodeIdBeforeMergeStep(mergeStepId: string, newNodeId: string): void {
    const parentGroup = this.projectService.getParentGroup(mergeStepId);
    parentGroup.ids.splice(parentGroup.ids.indexOf(mergeStepId), 0, newNodeId);
  }
}
