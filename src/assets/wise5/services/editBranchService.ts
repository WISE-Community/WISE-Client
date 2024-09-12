import { Injectable } from '@angular/core';
import { AuthorBranchService } from './authorBranchService';
import { AuthorBranchParams } from '../common/AuthorBranchParams';
import { TeacherProjectService } from './teacherProjectService';
import { DeleteBranchService } from './deleteBranchService';
import {
  CHOICE_CHOSEN_VALUE,
  RANDOM_VALUE,
  SCORE_VALUE,
  WORKGROUP_ID_VALUE
} from '../../../app/domain/branchCriteria';

@Injectable()
export class EditBranchService extends AuthorBranchService {
  constructor(
    private deleteBranchService: DeleteBranchService,
    protected projectService: TeacherProjectService
  ) {
    super(projectService);
  }

  editBranch(node: any, branchPaths: any[], params: AuthorBranchParams): Promise<void> {
    this.projectService.parseProject();
    this.createNewPaths(branchPaths, params);
    this.removePaths(branchPaths, params);
    this.updateTransitions(node, params);
    this.updateTransitionLogic(node, params);
    return this.projectService.saveProject();
  }

  private createNewPaths(branchPaths: any[], params: AuthorBranchParams): void {
    branchPaths.forEach((path: any, index: number) => {
      if (path.new) {
        this.addBranchPath(index, params);
      }
    });
  }

  addBranchPath(pathIndex: number, params: AuthorBranchParams): void {
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

  private removePaths(branchPaths: any[], params: AuthorBranchParams): void {
    const nodeIdAfterMergeStep = this.projectService.getNodeIdAfter(params.mergeStepId);
    let nodeIdToPlaceAfter = params.mergeStepId;
    branchPaths
      .filter((path: any) => path.delete)
      .forEach((path: any) => {
        this.deleteBranchService.deleteBranchPathAndPlaceAfter(
          branchPaths,
          path,
          params.branchStepId,
          nodeIdToPlaceAfter,
          nodeIdAfterMergeStep
        );
        nodeIdToPlaceAfter = path.nodesInBranchPath[path.nodesInBranchPath.length - 1].nodeId;
      });
  }

  private updateTransitions(node: any, params: AuthorBranchParams): void {
    for (let x = 0; x < node.transitionLogic.transitions.length; x++) {
      const transition = node.transitionLogic.transitions[x];
      if (params.criteria === SCORE_VALUE) {
        transition.criteria = [
          {
            name: SCORE_VALUE,
            params: {
              componentId: params.componentId,
              nodeId: params.nodeId,
              scores: params.paths[x].split(',')
            }
          }
        ];
      } else if (params.criteria === CHOICE_CHOSEN_VALUE) {
        transition.criteria = [
          {
            name: CHOICE_CHOSEN_VALUE,
            params: {
              choiceIds: [params.paths[x]],
              componentId: params.componentId,
              nodeId: params.nodeId
            }
          }
        ];
      } else {
        delete transition.criteria;
      }
    }
  }

  private updateTransitionLogic(node: any, params: AuthorBranchParams): void {
    if (params.criteria === WORKGROUP_ID_VALUE || params.criteria === RANDOM_VALUE) {
      node.transitionLogic.howToChooseAmongAvailablePaths = params.criteria;
      node.transitionLogic.whenToChoosePath = 'enterNode';
    } else {
      node.transitionLogic.howToChooseAmongAvailablePaths = RANDOM_VALUE;
      node.transitionLogic.whenToChoosePath =
        params.branchStepId === params.nodeId ? 'studentDataChanged' : 'enterNode';
    }
  }
}
