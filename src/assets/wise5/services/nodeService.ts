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
export abstract class NodeService {
  private transitionResults = {};
  private chooseTransitionPromises = {};
  private nodeSubmitClickedSource: Subject<any> = new Subject<any>();
  public nodeSubmitClicked$: Observable<any> = this.nodeSubmitClickedSource.asObservable();
  private doneRenderingComponentSource: Subject<any> = new Subject<any>();
  public doneRenderingComponent$ = this.doneRenderingComponentSource.asObservable();

  constructor(
    protected dataService: DataService,
    protected dialog: MatDialog,
    protected configService: ConfigService,
    protected constraintService: ConstraintService,
    protected projectService: ProjectService
  ) {}

  setCurrentNode(nodeId: string): void {
    this.dataService.setCurrentNodeByNodeId(nodeId);
  }

  goToNextNode(): Promise<string> {
    return this.getNextNodeId().then((nextNodeId: string) => {
      if (nextNodeId != null) {
        this.setCurrentNode(nextNodeId);
      }
      return nextNodeId;
    });
  }

  abstract getNextNodeId(currentId?: string): Promise<any>;

  goToPrevNode(): void {
    this.setCurrentNode(this.getPrevNodeId());
  }

  abstract getPrevNodeId(currentId?: string): string;

  /**
   * Close the current node (and open the current node's parent group)
   */
  closeNode() {
    let currentNode = null;
    currentNode = this.dataService.getCurrentNode();
    if (currentNode) {
      let currentNodeId = currentNode.id;
      let parentNode = this.projectService.getParentGroup(currentNodeId);
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

  broadcastNodeSubmitClicked(args: any) {
    this.nodeSubmitClickedSource.next(args);
  }

  broadcastDoneRenderingComponent(nodeIdAndComponentId: any) {
    this.doneRenderingComponentSource.next(nodeIdAndComponentId);
  }
}
