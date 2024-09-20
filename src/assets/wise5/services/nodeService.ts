'use strict';

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';
import { ChooseBranchPathDialogComponent } from '../../../app/preview/modules/choose-branch-path-dialog/choose-branch-path-dialog.component';
import { DataService } from '../../../app/services/data.service';
import { Observable, Subject } from 'rxjs';
import { ConstraintService } from './constraintService';
import { TransitionLogic } from '../common/TransitionLogic';

@Injectable()
export class NodeService {
  private transitionResults = {};
  private chooseTransitionPromises = {};
  private nodeSubmitClickedSource: Subject<any> = new Subject<any>();
  public nodeSubmitClicked$: Observable<any> = this.nodeSubmitClickedSource.asObservable();
  private doneRenderingComponentSource: Subject<any> = new Subject<any>();
  public doneRenderingComponent$ = this.doneRenderingComponentSource.asObservable();

  constructor(
    protected dialog: MatDialog,
    protected ConfigService: ConfigService,
    protected constraintService: ConstraintService,
    protected ProjectService: ProjectService,
    protected DataService: DataService
  ) {}

  setCurrentNode(nodeId: string): void {
    this.DataService.setCurrentNodeByNodeId(nodeId);
  }

  goToNextNode() {
    return this.getNextNodeId().then((nextNodeId) => {
      if (nextNodeId != null) {
        const mode = this.ConfigService.getMode();
        this.setCurrentNode(nextNodeId);
      }
      return nextNodeId;
    });
  }

  /**
   * This function should be implemented by the child service classes
   */
  getNextNodeId(currentId?: string): Promise<any> {
    return null;
  }

  /**
   * Go to the next node that captures work
   * @return a promise that will return the next node id
   */
  goToNextNodeWithWork(): Promise<string> {
    return this.getNextNodeIdWithWork().then((nextNodeId: string) => {
      if (nextNodeId) {
        this.setCurrentNode(nextNodeId);
      }
      return nextNodeId;
    });
  }

  /**
   * Get the next node id in the project sequence that captures student work
   * @param currentId (optional)
   * @returns next node id
   */
  getNextNodeIdWithWork(currentId = null) {
    return this.getNextNodeId(currentId).then((nextNodeId: string) => {
      if (nextNodeId) {
        if (this.ProjectService.nodeHasWork(nextNodeId)) {
          return nextNodeId;
        } else {
          return this.getNextNodeIdWithWork(nextNodeId);
        }
      } else {
        return null;
      }
    });
  }

  goToPrevNode() {
    const prevNodeId = this.getPrevNodeId();
    this.setCurrentNode(prevNodeId);
  }

  /**
   * Get the previous node in the project sequence
   * @param currentId (optional)
   */
  getPrevNodeId(currentId?: string): string {
    let prevNodeId = null;
    const currentNodeId = currentId ?? this.DataService.getCurrentNodeId();
    if (currentNodeId) {
      if (['author', 'classroomMonitor'].includes(this.ConfigService.getMode())) {
        const currentNodeOrder = this.ProjectService.getNodeOrderById(currentNodeId);
        if (currentNodeOrder) {
          const prevId = this.ProjectService.getNodeIdByOrder(currentNodeOrder - 1);
          if (prevId) {
            prevNodeId = this.ProjectService.isApplicationNode(prevId)
              ? prevId
              : this.getPrevNodeId(prevId);
          }
        }
      } else {
        // get all the nodes that transition to the current node
        const nodeIdsByToNodeId = this.ProjectService.getNodesByToNodeId(currentNodeId).map(
          (node) => node.id
        );
        if (nodeIdsByToNodeId.length === 1) {
          // there is only one node that transitions to the current node
          prevNodeId = nodeIdsByToNodeId[0];
        } else if (nodeIdsByToNodeId.length > 1) {
          // there are multiple nodes that transition to the current node

          const stackHistory = this.DataService.getStackHistory();

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
    }
    return prevNodeId;
  }

  /**
   * Go to the previous node that captures work
   */
  goToPrevNodeWithWork() {
    const prevNodeId = this.getPrevNodeIdWithWork();
    this.setCurrentNode(prevNodeId);
  }

  /**
   * Get the previous node id in the project sequence that captures student work
   * @param currentId (optional)
   * @returns next node id
   */
  getPrevNodeIdWithWork(currentId = null) {
    const prevNodeId = this.getPrevNodeId(currentId);
    if (prevNodeId) {
      if (this.ProjectService.nodeHasWork(prevNodeId)) {
        return prevNodeId;
      } else {
        return this.getPrevNodeIdWithWork(prevNodeId);
      }
    } else {
      return null;
    }
  }

  /**
   * Close the current node (and open the current node's parent group)
   */
  closeNode() {
    let currentNode = null;
    currentNode = this.DataService.getCurrentNode();
    if (currentNode) {
      let currentNodeId = currentNode.id;
      let parentNode = this.ProjectService.getParentGroup(currentNodeId);
      let parentNodeId = parentNode.id;
      this.setCurrentNode(parentNodeId);
    }
  }

  /**
   * Choose the transition the student will take
   * @param nodeId the current node id
   * @param transitionLogic an object containing transitions and parameters
   * for how to choose a transition
   * @returns a promise that will return a transition
   */
  protected chooseTransition(nodeId: string, transitionLogic: TransitionLogic): Promise<any> {
    if (this.ConfigService.isPreview() && this.chooseTransitionPromises[nodeId] != null) {
      return this.chooseTransitionPromises[nodeId];
    }
    const promise = this.getChooseTransitionPromise(nodeId, transitionLogic);
    if (this.ConfigService.isPreview()) {
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
          if (this.ConfigService.isPreview()) {
            // we are in preview mode so we will let the user choose the branch path to go to
            if (transitionResult != null) {
              /*
               * the user has previously chosen the branch path so we will use the transition
               * they last chose and not ask them again
               */
            } else {
              this.letUserChooseTransition(availableTransitions, nodeId, resolve);
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

  private letUserChooseTransition(
    availableTransitions: any[],
    nodeId: string,
    resolve: (value: any) => void
  ): void {
    const paths = [];
    for (const availableTransition of availableTransitions) {
      const toNodeId = availableTransition.to;
      const path = {
        nodeId: toNodeId,
        nodeTitle: this.ProjectService.getNodePositionAndTitle(toNodeId),
        transition: availableTransition
      };
      paths.push(path);
    }
    const dialogRef = this.dialog.open(ChooseBranchPathDialogComponent, {
      data: paths,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      resolve(result);
    });
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
      const index = this.ConfigService.getWorkgroupId() % availableTransitions.length;
      transitionResult = availableTransitions[index];
    } else if (howToChooseAmongAvailablePaths === 'firstAvailable') {
      transitionResult = availableTransitions[0];
    } else if (howToChooseAmongAvailablePaths === 'lastAvailable') {
      transitionResult = availableTransitions[availableTransitions.length - 1];
    }
    return transitionResult;
  }

  /**
   * Evaluate the transition logic for the current node and create branch
   * path taken event if necessary.
   */
  evaluateTransitionLogic(): void {
    const currentNode = this.ProjectService.getNode(this.DataService.getCurrentNodeId());
    const transitionLogic = currentNode.getTransitionLogic();
    const branchEvents = this.DataService.getBranchPathTakenEventsByNodeId(currentNode.id);
    const alreadyBranched = branchEvents.length > 0;
    if ((alreadyBranched && transitionLogic.canChangePath) || !alreadyBranched) {
      this.chooseTransition(currentNode.id, transitionLogic).then((transition) => {
        if (transition != null) {
          this.createBranchPathTakenEvent(currentNode.id, transition.to);
        }
      });
    }
  }

  /**
   * Create a branchPathTaken event
   * @param fromNodeId the from node id
   * @param toNodeid the to node id
   */
  createBranchPathTakenEvent(fromNodeId, toNodeId) {
    const nodeId = fromNodeId;
    const componentId = null;
    const componentType = null;
    const category = 'Navigation';
    const event = 'branchPathTaken';
    const eventData = {
      fromNodeId: fromNodeId,
      toNodeId: toNodeId
    };
    this.DataService.saveVLEEvent(nodeId, componentId, componentType, category, event, eventData);
  }

  broadcastNodeSubmitClicked(args: any) {
    this.nodeSubmitClickedSource.next(args);
  }

  broadcastDoneRenderingComponent(nodeIdAndComponentId: any) {
    this.doneRenderingComponentSource.next(nodeIdAndComponentId);
  }
}
