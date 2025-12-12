import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChooseBranchPathDialogComponent } from '../../../app/preview/modules/choose-branch-path-dialog/choose-branch-path-dialog.component';
import { Constraint } from '../../../app/domain/constraint';
import { TransitionLogic } from '../common/TransitionLogic';
import { DialogWithCloseComponent } from '../directives/dialog-with-close/dialog-with-close.component';
import { NodeService } from './nodeService';
import { NodeStatusService } from './nodeStatusService';
import { StudentDataService } from './studentDataService';

@Injectable()
export class StudentNodeService extends NodeService {
  protected override dataService = inject(StudentDataService);
  private dialog = inject(MatDialog);
  private nodeStatusService = inject(NodeStatusService);

  private chooseTransitionPromises = {};
  private transitionResults = {};

  setCurrentNode(nodeId: string): void {
    if (this.nodeStatusService.getNodeStatusByNodeId(nodeId).isVisitable) {
      this.dataService.setCurrentNodeByNodeId(nodeId);
    } else {
      this.showNodeLockedDialog(nodeId);
    }
  }

  private showNodeLockedDialog(nodeId: string): void {
    const node = this.projectService.getNodeById(nodeId);
    const constraints = this.constraintService.getConstraintsThatAffectNode(node);
    const message =
      constraints.length > 0
        ? this.getConstraintsMessage(nodeId, constraints)
        : $localize`Sorry, you cannot view this item yet.`;
    this.dialog.open(DialogWithCloseComponent, {
      data: {
        content: message,
        title: $localize`Item Locked`
      }
    });
  }

  private getConstraintsMessage(nodeId: string, constraints: Constraint[]): string {
    const nodeTitle = this.projectService.getNodePositionAndTitle(nodeId);
    let message = $localize`<p>To visit <b>${nodeTitle}</b> you need to:</p><ul>`;
    this.constraintService.orderConstraints(constraints);
    for (const constraint of constraints) {
      if (!this.constraintService.evaluateConstraint(constraint)) {
        message += `<li>${this.getConstraintMessage(constraint)}</li>`;
      }
    }
    message += `</ul>`;
    return message;
  }

  /**
   * Get the message that describes how to disable the constraint
   * @param constraint the constraint that is preventing the student from going to the node
   * @returns the message to display to the student that describes how to disable the constraint
   */
  private getConstraintMessage(constraint: Constraint): string {
    return constraint.removalCriteria
      .map((criterion) => this.constraintService.getCriteriaMessage(criterion))
      .filter((message) => message != '')
      .join('<br/>');
  }

  getPrevNodeId(currentId?: string): string {
    let prevNodeId = null;
    const currentNodeId = currentId ?? this.dataService.getCurrentNodeId();
    if (currentNodeId) {
      // get all the nodes that transition to the current node
      const nodeIdsByToNodeId = this.projectService
        .getNodesByToNodeId(currentNodeId)
        .map((node) => node.id);
      if (nodeIdsByToNodeId.length === 1) {
        // there is only one node that transitions to the current node
        prevNodeId = nodeIdsByToNodeId[0];
      } else if (nodeIdsByToNodeId.length > 1) {
        // there are multiple nodes that transition to the current node
        const stackHistory = this.dataService.getStackHistory();
        // loop through the stack history node ids from newest to oldest
        for (let s = stackHistory.length - 1; s >= 0; s--) {
          const stackHistoryNodeId = stackHistory[s];
          if (nodeIdsByToNodeId.indexOf(stackHistoryNodeId) != -1) {
            // we have found a node that we previously visited that transitions to the current node
            prevNodeId = stackHistoryNodeId;
            break;
          }
        }
      }
    }
    return prevNodeId;
  }

  /**
   * Get the next node in the project sequence. We return a promise because in preview mode we allow
   * the user to specify which branch path they want to go to. In all other cases we will resolve
   * the promise immediately.
   * @param currentId (optional) the current node id
   * @returns a promise that returns the next node id
   */
  getNextNodeId(currentId?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const currentNodeId = currentId ?? this.dataService.getCurrentNodeId();
      const transitionLogic = this.projectService.getNode(currentNodeId).getTransitionLogic();
      const branchPathTakenEvents =
        this.dataService.getBranchPathTakenEventsByNodeId(currentNodeId);
      if (this.hasPreviouslyBranchedAndCannotChange(branchPathTakenEvents, transitionLogic)) {
        resolve(branchPathTakenEvents.at(-1).data.toNodeId);
      } else {
        this.resolveNextNodeIdFromTransition(resolve, currentNodeId);
      }
    });
  }

  private hasPreviouslyBranchedAndCannotChange(
    branchPathTakenEvents: any[],
    transitionLogic: TransitionLogic
  ): boolean {
    return branchPathTakenEvents.length > 0 && !transitionLogic.canChangePath;
  }

  private resolveNextNodeIdFromTransition(resolve: any, currentNodeId: string): void {
    const transitionLogic = this.projectService.getNode(currentNodeId).getTransitionLogic();
    if (transitionLogic.transitions.length == 0) {
      this.getNextNodeIdFromParent(resolve, currentNodeId);
    } else {
      this.chooseTransition(currentNodeId, transitionLogic).then((transition: any) => {
        resolve(transition.to);
      });
    }
  }

  private getNextNodeIdFromParent(resolve: any, currentNodeId: string): void {
    const parentGroupId = this.projectService.getParentGroupId(currentNodeId);
    if (parentGroupId != null) {
      const parentTransitionLogic = this.projectService.getNode(parentGroupId).getTransitionLogic();
      this.chooseTransition(parentGroupId, parentTransitionLogic).then((transition: any) => {
        const transitionToNodeId = transition.to;
        const startId = this.projectService.isGroupNode(transitionToNodeId)
          ? this.projectService.getGroupStartId(transitionToNodeId)
          : null;
        resolve(startId == null || startId === '' ? transitionToNodeId : startId);
      });
    }
  }

  /**
   * Evaluate the transition logic for the current node and create branch
   * path taken event if necessary.
   */
  evaluateTransitionLogic(): void {
    const currentNode = this.projectService.getNode(this.dataService.getCurrentNodeId());
    const transitionLogic = currentNode.getTransitionLogic();
    const branchEvents = this.dataService.getBranchPathTakenEventsByNodeId(currentNode.id);
    const alreadyBranched = branchEvents.length > 0;
    if ((alreadyBranched && transitionLogic.canChangePath) || !alreadyBranched) {
      this.chooseTransition(currentNode.id, transitionLogic).then((transition) => {
        if (transition != null) {
          this.saveBranchPathTakenEvent(currentNode.id, transition.to);
        }
      });
    }
  }

  private saveBranchPathTakenEvent(fromNodeId: string, toNodeId: string): void {
    this.dataService.saveVLEEvent(fromNodeId, null, null, 'Navigation', 'branchPathTaken', {
      fromNodeId: fromNodeId,
      toNodeId: toNodeId
    });
  }

  /**
   * Choose the transition the student will take
   * @param nodeId the current node id
   * @param transitionLogic an object containing transitions and parameters
   * for how to choose a transition
   * @returns a promise that will return a transition
   */
  protected chooseTransition(nodeId: string, transitionLogic: TransitionLogic): Promise<any> {
    if (this.configService.isPreview() && this.chooseTransitionPromises[nodeId] != null) {
      return this.chooseTransitionPromises[nodeId];
    }
    const promise = this.getChooseTransitionPromise(nodeId, transitionLogic);
    if (this.configService.isPreview()) {
      const availableTransitions = this.getAvailableTransitions(transitionLogic.transitions);
      const transitionResult = this.transitionResults[nodeId];
      if (availableTransitions.length > 1 && transitionResult == null) {
        this.chooseTransitionPromises[nodeId] = promise;
      }
    }
    return promise;
  }

  private getChooseTransitionPromise(
    nodeId: string,
    transitionLogic: TransitionLogic
  ): Promise<any> {
    return new Promise((resolve) => {
      let transitionResult = this.transitionResults[nodeId];
      if (transitionResult == null || transitionLogic.canChangePath) {
        /*
         * we have not previously calculated the transition or the
         * transition logic allows the student to change branch paths
         * so we will calculate the transition again
         */
        const transitions = transitionLogic.transitions;
        const availableTransitions = this.getAvailableTransitions(transitions);
        if (availableTransitions.length == 0) {
          transitionResult = null;
        } else if (availableTransitions.length == 1) {
          transitionResult = availableTransitions[0];
        } else if (availableTransitions.length > 1) {
          if (this.configService.isPreview()) {
            // we are in preview mode so we will let the user choose the branch path to go to
            if (transitionResult != null) {
              /*
               * the user has previously chosen the branch path so we will use the transition
               * they last chose and not ask them again
               */
            } else {
              this.letUserChooseTransition(availableTransitions, resolve);
            }
          } else {
            transitionResult = this.chooseTransitionAutomatically(
              transitionLogic.howToChooseAmongAvailablePaths,
              availableTransitions,
              transitionResult
            );
          }
        }
      }
      if (transitionResult != null) {
        this.transitionResults[nodeId] = transitionResult;
        resolve(transitionResult);
      }
    });
  }

  private getAvailableTransitions(transitions: any): any[] {
    return transitions.filter(
      (transition) =>
        transition.criteria == null || this.constraintService.evaluateCriterias(transition.criteria)
    );
  }

  private letUserChooseTransition(transitions: any[], resolve: (value: any) => void): void {
    this.dialog
      .open(ChooseBranchPathDialogComponent, {
        data: transitions.map((transition) => ({
          nodeId: transition.to,
          nodeTitle: this.projectService.getNodePositionAndTitle(transition.to),
          transition: transition
        })),
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => resolve(result));
  }

  private chooseTransitionAutomatically(
    howToChooseAmongAvailablePaths: string,
    availableTransitions: any[],
    transitionResult: any
  ): any {
    if ([null, '', 'random'].includes(howToChooseAmongAvailablePaths)) {
      const randomIndex = Math.floor(Math.random() * availableTransitions.length);
      transitionResult = availableTransitions[randomIndex];
    } else if (howToChooseAmongAvailablePaths === 'workgroupId') {
      const index = this.configService.getWorkgroupId() % availableTransitions.length;
      transitionResult = availableTransitions[index];
    } else if (howToChooseAmongAvailablePaths === 'firstAvailable') {
      transitionResult = availableTransitions[0];
    } else if (howToChooseAmongAvailablePaths === 'lastAvailable') {
      transitionResult = availableTransitions[availableTransitions.length - 1];
    }
    return transitionResult;
  }
}
