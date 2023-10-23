'use strict';

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';
import { ChooseBranchPathDialogComponent } from '../../../app/preview/modules/choose-branch-path-dialog/choose-branch-path-dialog.component';
import { DataService } from '../../../app/services/data.service';
import { Observable, Subject } from 'rxjs';
import { ConstraintService } from './constraintService';

@Injectable()
export class NodeService {
  transitionResults = {};
  chooseTransitionPromises = {};
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
  getPrevNodeId(currentId?) {
    let prevNodeId = null;
    let currentNodeId = null;
    const mode = this.ConfigService.getMode();
    if (currentId) {
      currentNodeId = currentId;
    } else {
      let currentNode = null;
      currentNode = this.DataService.getCurrentNode();
      if (currentNode) {
        currentNodeId = currentNode.id;
      }
    }
    if (currentNodeId) {
      if (['classroomMonitor', 'author'].includes(mode)) {
        let currentNodeOrder = this.ProjectService.getNodeOrderById(currentNodeId);
        if (currentNodeOrder) {
          let prevNodeOrder = currentNodeOrder - 1;
          let prevId = this.ProjectService.getNodeIdByOrder(prevNodeOrder);
          if (prevId) {
            if (this.ProjectService.isApplicationNode(prevId)) {
              // node is a step, so set it as the next node
              prevNodeId = prevId;
            } else if (this.ProjectService.isGroupNode(prevId)) {
              // node is an activity, so get next nodeId
              prevNodeId = this.getPrevNodeId(prevId);
            }
          }
        }
      } else {
        // get all the nodes that transition to the current node
        const nodeIdsByToNodeId = this.ProjectService.getNodesWithTransitionToNodeId(currentNodeId);
        if (nodeIdsByToNodeId == null) {
        } else if (nodeIdsByToNodeId.length === 1) {
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
  chooseTransition(nodeId, transitionLogic): any {
    const existingPromise = this.getChooseTransitionPromise(nodeId);
    if (existingPromise != null) {
      return existingPromise;
    }
    const promise = new Promise((resolve, reject) => {
      let transitionResult = this.getTransitionResultByNodeId(nodeId);
      if (
        transitionResult == null ||
        (transitionLogic != null && transitionLogic.canChangePath == true)
      ) {
        /*
         * we have not previously calculated the transition or the
         * transition logic allows the student to change branch paths
         * so we will calculate the transition again
         */
        const transitions = transitionLogic.transitions;
        if (transitions != null) {
          const availableTransitions = this.getAvailableTransitions(transitions);
          if (availableTransitions.length == 0) {
            transitionResult = null;
          } else if (availableTransitions.length == 1) {
            transitionResult = availableTransitions[0];
          } else if (availableTransitions.length > 1) {
            if (this.ConfigService.isPreview()) {
              /*
               * we are in preview mode so we will let the user choose
               * the branch path to go to
               */
              if (transitionResult != null) {
                /*
                 * the user has previously chosen the branch path
                 * so we will use the transition they chose and
                 * not ask them again
                 */
              } else {
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
                  data: {
                    paths: paths,
                    nodeId: nodeId
                  },
                  disableClose: true
                });
                dialogRef.afterClosed().subscribe((result) => {
                  resolve(result);
                });
              }
            } else {
              /*
               * we are in regular student run mode so we will choose
               * the branch according to how the step was authored
               */
              const howToChooseAmongAvailablePaths = transitionLogic.howToChooseAmongAvailablePaths;
              if (
                howToChooseAmongAvailablePaths == null ||
                howToChooseAmongAvailablePaths === '' ||
                howToChooseAmongAvailablePaths === 'random'
              ) {
                // choose a random transition

                const randomIndex = Math.floor(Math.random() * availableTransitions.length);
                transitionResult = availableTransitions[randomIndex];
              } else if (howToChooseAmongAvailablePaths === 'workgroupId') {
                // use the workgroup id to choose the transition

                const workgroupId = this.ConfigService.getWorkgroupId();
                const index = workgroupId % availableTransitions.length;
                transitionResult = availableTransitions[index];
              } else if (howToChooseAmongAvailablePaths === 'firstAvailable') {
                // choose the first available transition

                transitionResult = availableTransitions[0];
              } else if (howToChooseAmongAvailablePaths === 'lastAvailable') {
                // choose the last available transition
                transitionResult = availableTransitions[availableTransitions.length - 1];
              }
            }
          }
        }
      }
      if (transitionResult != null) {
        this.setTransitionResult(nodeId, transitionResult);
        resolve(transitionResult);
      }
    });
    const availableTransitions = this.getAvailableTransitions(transitionLogic.transitions);
    const transitionResult = this.getTransitionResultByNodeId(nodeId);
    if (
      this.ConfigService.isPreview() &&
      availableTransitions.length > 1 &&
      transitionResult == null
    ) {
      this.setChooseTransitionPromise(nodeId, promise);
    }
    return promise;
  }

  getAvailableTransitions(transitions: any) {
    const availableTransitions = [];
    for (const transition of transitions) {
      const criteria = transition.criteria;
      if (
        criteria == null ||
        (criteria != null && this.constraintService.evaluateCriterias(criteria))
      ) {
        availableTransitions.push(transition);
      }
    }
    return availableTransitions;
  }

  currentNodeHasTransitionLogic() {
    const currentNode: any = this.DataService.getCurrentNode();
    if (currentNode != null) {
      const transitionLogic = currentNode.transitionLogic;
      if (transitionLogic != null) {
        return true;
      }
    }
    return false;
  }

  /**
   * Evaluate the transition logic for the current node and create branch
   * path taken events if necessary.
   */
  evaluateTransitionLogic() {
    const currentNode: any = this.DataService.getCurrentNode();
    if (currentNode != null) {
      const nodeId = currentNode.id;
      const transitionLogic = currentNode.transitionLogic;
      if (transitionLogic != null) {
        const transitions = transitionLogic.transitions;
        const canChangePath = transitionLogic.canChangePath;
        let alreadyBranched = false;
        const events = this.DataService.getBranchPathTakenEventsByNodeId(currentNode.id);
        if (events.length > 0) {
          alreadyBranched = true;
        }

        let transition, fromNodeId, toNodeId;
        if (alreadyBranched) {
          if (canChangePath) {
            this.chooseTransition(nodeId, transitionLogic).then((transition) => {
              if (transition != null) {
                fromNodeId = currentNode.id;
                toNodeId = transition.to;
                this.createBranchPathTakenEvent(fromNodeId, toNodeId);
              }
            });
          } else {
            // student can't change path
          }
        } else {
          // student has not branched yet

          this.chooseTransition(nodeId, transitionLogic).then((transition) => {
            if (transition != null) {
              fromNodeId = currentNode.id;
              toNodeId = transition.to;
              this.createBranchPathTakenEvent(fromNodeId, toNodeId);
            }
          });
        }
      }
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

  evaluateTransitionLogicOn(event) {
    const currentNode: any = this.DataService.getCurrentNode();
    if (currentNode != null) {
      const transitionLogic = currentNode.transitionLogic;
      const whenToChoosePath = transitionLogic.whenToChoosePath;
      if (event === whenToChoosePath) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get the transition result for a node
   * @param nodeId the the node id
   * @returns the transition object that was chosen for the node
   */
  getTransitionResultByNodeId(nodeId) {
    return this.transitionResults[nodeId];
  }

  /**
   * Set the transition result for a node
   * @param nodeId the node id
   * @param transitionResult the transition object that was chosen for the node
   */
  setTransitionResult(nodeId, transitionResult) {
    if (nodeId != null) {
      this.transitionResults[nodeId] = transitionResult;
    }
  }

  /**
   * Get the promise that was created for a specific node when the
   * chooseTransition() function was called. This promise has not been
   * resolved yet.
   * @param nodeId the node id
   * @returns the promise that was created when chooseTransition() was called
   * or null if there is no unresolved promise.
   */
  getChooseTransitionPromise(nodeId) {
    return this.chooseTransitionPromises[nodeId];
  }

  /**
   * Set the promise that was created for a specific node when the
   * chooseTransition() function was called. This promise has not been
   * resolved yet.
   * @param nodeId the node id
   * @param promise the promise
   */
  setChooseTransitionPromise(nodeId, promise) {
    this.chooseTransitionPromises[nodeId] = promise;
  }

  broadcastNodeSubmitClicked(args: any) {
    this.nodeSubmitClickedSource.next(args);
  }

  broadcastDoneRenderingComponent(nodeIdAndComponentId: any) {
    this.doneRenderingComponentSource.next(nodeIdAndComponentId);
  }
}
