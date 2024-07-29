import { Injectable } from '@angular/core';
import { TeacherProjectService } from './teacherProjectService';

@Injectable()
export class DeleteBranchService {
  constructor(private projectService: TeacherProjectService) {}

  removeBranch(branchPaths: any[], targetId: string): void {
    for (let bp = 0; bp < branchPaths.length; bp++) {
      const branchPath = branchPaths[bp];
      this.removeBranchPath(branchPaths, branchPath, targetId);
      bp--; // shift the counter back one because we have just removed a branch path
    }
    const nodeIdAfter = this.projectService.getNodeIdAfter(targetId);
    /*
     * update the transition of this step to point to the next step
     * in the project. this may be different than the next step
     * if it was still the branch point.
     */
    this.projectService.setTransition(targetId, nodeIdAfter);
    this.projectService.setTransitionLogicField(targetId, 'howToChooseAmongAvailablePaths', null);
    this.projectService.setTransitionLogicField(targetId, 'whenToChoosePath', null);
    this.projectService.setTransitionLogicField(targetId, 'canChangePath', null);
    this.projectService.setTransitionLogicField(targetId, 'maxPathsVisitable', null);
    this.projectService.calculateNodeNumbers();
  }

  /**
   * Remove a branch path by removing all the branch path taken constraints
   * from the steps in the branch path, resetting the transitions in the
   * steps in the branch path, and removing the transition corresponding to
   * the branch path in this branch point node.
   * @param branch the branch object
   */
  private removeBranchPath(branchPaths: any[], branch: any, targetId: string): void {
    for (const nodeInBranchPath of branch.nodesInBranchPath) {
      const nodeId = nodeInBranchPath.nodeId;
      this.projectService.removeBranchPathTakenNodeConstraintsIfAny(nodeId);
      /*
       * update the transition of the step to point to the next step
       * in the project. this may be different than the next step
       * if it was still in the branch path.
       */
      const nodeIdAfter = this.projectService.getNodeIdAfter(nodeId);
      this.projectService.setTransition(nodeId, nodeIdAfter);
    }
    const branchPathIndex = branchPaths.indexOf(branch);
    branchPaths.splice(branchPathIndex, 1);
    const node = this.projectService.getNodeById(targetId);
    node.transitionLogic.transitions.splice(branchPathIndex, 1);
  }
}
