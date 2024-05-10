import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeacherProjectService } from './teacherProjectService';
import { DialogWithSpinnerComponent } from '../directives/dialog-with-spinner/dialog-with-spinner.component';
import {
  CHOICE_CHOSEN_VALUE,
  SCORE_VALUE,
  WORKGROUP_ID_VALUE
} from '../../../app/domain/branchCriteria';
import { CreateBranchParams } from '../common/CreateBranchParams';
import { Transition } from '../common/Transition';
import { TransitionCriteria } from '../common/TransitionCriteria';
import { TransitionCriteriaParams } from '../common/TransitionCriteriaParams';

@Injectable()
export class CreateBranchService {
  protected readonly CHOICE_CHOSEN_VALUE: string = CHOICE_CHOSEN_VALUE;
  protected readonly SCORE_VALUE: string = SCORE_VALUE;

  constructor(private dialog: MatDialog, private projectService: TeacherProjectService) {}

  createBranch(params: CreateBranchParams): Promise<void> {
    this.showCreatingBranchMessage();
    const targetNode = this.projectService.getNodeById(params.branchStepId);
    const nodeIdTargetNodeTransitionsTo =
      targetNode.transitionLogic.transitions.length > 0
        ? targetNode.transitionLogic.transitions[0].to
        : '';
    targetNode.transitionLogic.transitions = [];
    const newNodeIds = this.createNewNodeIds(params.pathCount);
    this.createPathSteps(params, targetNode, newNodeIds);
    const mergeStep: any =
      params.mergeStepId === ''
        ? this.createMergeStep(newNodeIds, nodeIdTargetNodeTransitionsTo)
        : this.projectService.getNodeById(params.mergeStepId);
    this.setPathStepTransitions(newNodeIds, mergeStep.id);
    this.setTargetNodeTransitionLogic(targetNode, params.criteria);
    this.addNewNodeIdsToParentGroup(params.branchStepId, [...newNodeIds, mergeStep.id]);
    return this.projectService.saveProject().then(() => {
      this.hideCreatingBranchMessage();
    });
  }

  private createNewNodeIds(pathCount: number): string[] {
    const newNodeIds = [];
    for (let i = 0; i < pathCount; i++) {
      const newNodeId = this.projectService.getNextAvailableNodeId(newNodeIds);
      newNodeIds.push(newNodeId);
    }
    return newNodeIds;
  }

  private createPathSteps(params: any, targetNode: any, newNodeIds: string[]): void {
    for (let i = 0; i < newNodeIds.length; i++) {
      const pathNumber = i + 1;
      const newNode = this.projectService.createNode($localize`Path ${pathNumber}`);
      newNode.id = newNodeIds[i];
      this.addTransitionFromTargetNodeToPathNode(params, targetNode, newNode, pathNumber);
      this.projectService.addNode(newNode);
      this.projectService.addApplicationNode(newNode);
      this.projectService.setIdToNode(newNode.id, newNode);
      this.projectService.addBranchPathTakenConstraints(newNode.id, targetNode.id, newNode.id);
    }
  }

  private addTransitionFromTargetNodeToPathNode(
    params: any,
    targetNode: any,
    newNode: any,
    pathNumber: number
  ): void {
    switch (params.criteria) {
      case this.SCORE_VALUE:
        targetNode.transitionLogic.transitions.push(
          new Transition(newNode.id, [
            new TransitionCriteria(
              SCORE_VALUE,
              new TransitionCriteriaParams({
                componentId: params.componentId,
                nodeId: params.nodeId,
                scores: [params.paths[pathNumber - 1]]
              })
            )
          ])
        );
        targetNode.transitionLogic.whenToChoosePath = 'studentDataChanged';
        break;
      case this.CHOICE_CHOSEN_VALUE:
        targetNode.transitionLogic.transitions.push(
          new Transition(newNode.id, [
            new TransitionCriteria(
              CHOICE_CHOSEN_VALUE,
              new TransitionCriteriaParams({
                choiceIds: [params.paths[pathNumber - 1]],
                componentId: params.componentId,
                nodeId: params.nodeId
              })
            )
          ])
        );
        targetNode.transitionLogic.whenToChoosePath = 'studentDataChanged';
        break;
      default:
        targetNode.transitionLogic.transitions.push(new Transition(newNode.id));
        targetNode.transitionLogic.whenToChoosePath = 'enterNode';
    }
  }

  private createMergeStep(newNodeIds: string[], nodeIdTargetNodeTransitionsTo: string): any {
    const mergeStepNode = this.projectService.createNode($localize`Merge Step`);
    const mergeStepNodeId = this.projectService.getNextAvailableNodeId(newNodeIds);
    mergeStepNode.id = mergeStepNodeId;
    if (nodeIdTargetNodeTransitionsTo !== '') {
      mergeStepNode.transitionLogic.transitions = [new Transition(nodeIdTargetNodeTransitionsTo)];
    }
    this.projectService.addNode(mergeStepNode);
    this.projectService.addApplicationNode(mergeStepNode);
    this.projectService.setIdToNode(mergeStepNode.id, mergeStepNode);
    return mergeStepNode;
  }

  private setPathStepTransitions(newNodeIds: string[], mergeStepId: string): void {
    for (const newNodeId of newNodeIds) {
      this.projectService.getNodeById(newNodeId).transitionLogic.transitions = [
        new Transition(mergeStepId)
      ];
    }
  }

  private setTargetNodeTransitionLogic(targetNode: any, criteria: string): void {
    targetNode.transitionLogic.maxPathsVisitable = 1;
    targetNode.transitionLogic.howToChooseAmongAvailablePaths =
      criteria === WORKGROUP_ID_VALUE ? WORKGROUP_ID_VALUE : 'random';
    targetNode.transitionLogic.canChangePath = false;
  }

  private addNewNodeIdsToParentGroup(branchStepId: string, newNodeIds: string[]): void {
    const parentGroup = this.projectService.getParentGroup(branchStepId);
    parentGroup.ids.splice(parentGroup.ids.indexOf(branchStepId) + 1, 0, ...newNodeIds);
  }

  private showCreatingBranchMessage(): void {
    this.dialog.open(DialogWithSpinnerComponent, {
      data: {
        title: $localize`Creating Branch`
      },
      disableClose: false
    });
  }

  private hideCreatingBranchMessage(): void {
    this.dialog.closeAll();
  }
}
