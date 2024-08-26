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
  constructor(
    private dialog: MatDialog,
    private projectService: TeacherProjectService
  ) {}

  createBranch(params: CreateBranchParams): Promise<void> {
    this.showCreatingBranchMessage();
    const branchNode = this.projectService.getNodeById(params.branchStepId);
    const nodeIdBranchNodeTransitionsTo =
      branchNode.transitionLogic.transitions.length > 0
        ? branchNode.transitionLogic.transitions[0].to
        : '';
    branchNode.transitionLogic.transitions = [];
    const newNodeIds = this.createNewNodeIds(params.pathCount);
    this.createPathSteps(params, branchNode, newNodeIds);
    const mergeStep: any =
      params.mergeStepId === ''
        ? this.createMergeStep(newNodeIds, nodeIdBranchNodeTransitionsTo)
        : this.projectService.getNodeById(params.mergeStepId);
    this.setPathStepTransitions(newNodeIds, mergeStep.id);
    this.setBranchNodeTransitionLogic(branchNode, params.criteria);
    if (params.mergeStepId === '') {
      newNodeIds.push(mergeStep.id);
    }
    this.addNewNodeIdsToParentGroup(params.branchStepId, newNodeIds);
    return this.projectService.saveProject().then(() => {
      this.hideCreatingBranchMessage();
    });
  }

  private createNewNodeIds(pathCount: number): string[] {
    const newNodeIds = [];
    for (let i = 0; i < pathCount; i++) {
      newNodeIds.push(this.projectService.getNextAvailableNodeId(newNodeIds));
    }
    return newNodeIds;
  }

  createPathSteps(params: CreateBranchParams, branchNode: any, newNodeIds: string[]): void {
    for (let i = 0; i < newNodeIds.length; i++) {
      this.createPathStep(params, branchNode, newNodeIds[i], i);
    }
  }

  private createPathStep(
    params: CreateBranchParams,
    branchNode: any,
    nodeId: string,
    index: number
  ): void {
    const pathNumber = index + 1;
    const newNode = this.projectService.createNode($localize`Path ${pathNumber}`);
    newNode.id = nodeId;
    this.addTransitionFromBranchNodeToPathNode(params, branchNode, newNode, pathNumber);
    this.projectService.addNode(newNode);
    this.projectService.addApplicationNode(newNode);
    this.projectService.setIdToNode(newNode.id, newNode);
    this.projectService.addBranchPathTakenConstraints(newNode.id, branchNode.id, newNode.id);
  }

  addBranchPath(pathIndex: number, params: any): void {
    const branchStep = this.projectService.getNodeById(params.branchStepId);
    const mergeStep = this.projectService.getNodeById(params.mergeStepId);
    const newNodeId = this.projectService.getNextAvailableNodeId();
    this.createPathStep(params, branchStep, newNodeId, pathIndex);
    this.setPathStepTransitions([newNodeId], mergeStep.id);
    this.setBranchNodeTransitionLogic(branchStep, params.criteria);
    this.addNewNodeIdBeforeMergeStep(params.mergeStepId, newNodeId);
  }

  private addTransitionFromBranchNodeToPathNode(
    params: CreateBranchParams,
    branchNode: any,
    newNode: any,
    pathNumber: number
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
                scores: [params.paths[pathNumber - 1]]
              })
            )
          ])
        );
        branchNode.transitionLogic.whenToChoosePath = 'studentDataChanged';
        break;
      case CHOICE_CHOSEN_VALUE:
        branchNode.transitionLogic.transitions.push(
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
        branchNode.transitionLogic.whenToChoosePath = 'studentDataChanged';
        break;
      default:
        branchNode.transitionLogic.transitions.push(new Transition(newNode.id));
        branchNode.transitionLogic.whenToChoosePath = 'enterNode';
    }
  }

  private createMergeStep(newNodeIds: string[], nodeIdBranchNodeTransitionsTo: string): any {
    const mergeStepNode = this.projectService.createNode($localize`Merge Step`);
    const mergeStepNodeId = this.projectService.getNextAvailableNodeId(newNodeIds);
    mergeStepNode.id = mergeStepNodeId;
    if (nodeIdBranchNodeTransitionsTo !== '') {
      mergeStepNode.transitionLogic.transitions = [new Transition(nodeIdBranchNodeTransitionsTo)];
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

  private setBranchNodeTransitionLogic(branchNode: any, criteria: string): void {
    branchNode.transitionLogic.maxPathsVisitable = 1;
    branchNode.transitionLogic.howToChooseAmongAvailablePaths =
      criteria === WORKGROUP_ID_VALUE ? WORKGROUP_ID_VALUE : 'random';
    branchNode.transitionLogic.canChangePath = false;
  }

  private addNewNodeIdsToParentGroup(branchStepId: string, newNodeIds: string[]): void {
    const parentGroup = this.projectService.getParentGroup(branchStepId);
    parentGroup.ids.splice(parentGroup.ids.indexOf(branchStepId) + 1, 0, ...newNodeIds);
  }

  private addNewNodeIdBeforeMergeStep(mergeStepId: string, newNodeId: string): void {
    const parentGroup = this.projectService.getParentGroup(mergeStepId);
    parentGroup.ids.splice(parentGroup.ids.indexOf(mergeStepId), 0, newNodeId);
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
