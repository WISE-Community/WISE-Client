import { CreateBranchParams } from '../common/CreateBranchParams';
import { TeacherProjectService } from './teacherProjectService';
import {
  CHOICE_CHOSEN_VALUE,
  SCORE_VALUE,
  WORKGROUP_ID_VALUE
} from '../../../app/domain/branchCriteria';
import { Transition } from '../common/Transition';
import { TransitionCriteria } from '../common/TransitionCriteria';
import { TransitionCriteriaParams } from '../common/TransitionCriteriaParams';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class AuthorBranchService {
  constructor(protected projectService: TeacherProjectService) {}

  protected createPathStep(
    params: CreateBranchParams,
    branchNode: any,
    nodeId: string,
    pathIndex: number
  ): void {
    const newNode = this.projectService.createNode($localize`Path ${pathIndex + 1}`);
    newNode.id = nodeId;
    this.addTransitionFromBranchNodeToPathNode(params, branchNode, newNode, pathIndex);
    this.projectService.addNode(newNode);
    this.projectService.addApplicationNode(newNode);
    this.projectService.setIdToNode(newNode.id, newNode);
    this.projectService.addBranchPathTakenConstraints(newNode.id, branchNode.id, newNode.id);
  }

  protected setPathStepTransitions(newNodeIds: string[], mergeStepId: string): void {
    for (const newNodeId of newNodeIds) {
      this.projectService.getNode(newNodeId).getTransitionLogic().transitions = [
        new Transition(mergeStepId)
      ];
    }
  }

  protected setBranchNodeTransitionLogic(branchNode: any, criteria: string): void {
    branchNode.transitionLogic.maxPathsVisitable = 1;
    branchNode.transitionLogic.howToChooseAmongAvailablePaths =
      criteria === WORKGROUP_ID_VALUE ? WORKGROUP_ID_VALUE : 'random';
    branchNode.transitionLogic.canChangePath = false;
  }

  private addTransitionFromBranchNodeToPathNode(
    params: CreateBranchParams,
    branchNode: any,
    newNode: any,
    pathIndex: number
  ): void {
    switch (params.criteria) {
      case SCORE_VALUE:
        branchNode.transitionLogic.transitions.push(
          new Transition(newNode.id, [
            new TransitionCriteria(
              SCORE_VALUE,
              new TransitionCriteriaParams({
                componentId: params.componentId,
                nodeId: params.nodeId,
                scores: params.paths[pathIndex].split(',')
              })
            )
          ])
        );
        branchNode.transitionLogic.whenToChoosePath =
          params.branchStepId === params.nodeId ? 'studentDataChanged' : 'enterNode';
        break;
      case CHOICE_CHOSEN_VALUE:
        branchNode.transitionLogic.transitions.push(
          new Transition(newNode.id, [
            new TransitionCriteria(
              CHOICE_CHOSEN_VALUE,
              new TransitionCriteriaParams({
                choiceIds: [params.paths[pathIndex]],
                componentId: params.componentId,
                nodeId: params.nodeId
              })
            )
          ])
        );
        branchNode.transitionLogic.whenToChoosePath =
          params.branchStepId === params.nodeId ? 'studentDataChanged' : 'enterNode';
        break;
      default:
        branchNode.transitionLogic.transitions.push(new Transition(newNode.id));
        branchNode.transitionLogic.whenToChoosePath = 'enterNode';
    }
  }
}
