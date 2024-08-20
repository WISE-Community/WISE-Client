import { Injectable } from '@angular/core';
import { NodeService } from './nodeService';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../app/services/data.service';
import { ConfigService } from './configService';
import { ConstraintService } from './constraintService';
import { ProjectService } from './projectService';
import { NodeStatusService } from './nodeStatusService';
import { DialogWithCloseComponent } from '../directives/dialog-with-close/dialog-with-close.component';
import { Constraint } from '../../../app/domain/constraint';
import { TransitionLogic } from '../common/TransitionLogic';

@Injectable()
export class StudentNodeService extends NodeService {
  constructor(
    protected dialog: MatDialog,
    protected configService: ConfigService,
    protected constraintService: ConstraintService,
    private nodeStatusService: NodeStatusService,
    protected projectService: ProjectService,
    protected dataService: DataService
  ) {
    super(dialog, configService, constraintService, projectService, dataService);
  }

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

  /**
   * Get the next node in the project sequence. We return a promise because in preview mode we allow
   * the user to specify which branch path they want to go to. In all other cases we will resolve
   * the promise immediately.
   * @param currentId (optional) the current node id
   * @returns a promise that returns the next node id
   */
  getNextNodeId(currentId?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const currentNodeId = currentId ?? this.DataService.getCurrentNodeId();
      const transitionLogic = this.ProjectService.getTransitionLogicByFromNodeId(currentNodeId);
      const branchPathTakenEvents =
        this.DataService.getBranchPathTakenEventsByNodeId(currentNodeId);
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
    const transitionLogic = this.ProjectService.getTransitionLogicByFromNodeId(currentNodeId);
    if (transitionLogic.transitions.length == 0) {
      this.getNextNodeIdFromParent(resolve, currentNodeId);
    } else {
      this.chooseTransition(currentNodeId, transitionLogic).then((transition: any) => {
        resolve(transition.to);
      });
    }
  }

  private getNextNodeIdFromParent(resolve: any, currentNodeId: string): void {
    const parentGroupId = this.ProjectService.getParentGroupId(currentNodeId);
    if (parentGroupId != null) {
      const parentTransitionLogic =
        this.ProjectService.getTransitionLogicByFromNodeId(parentGroupId);
      this.chooseTransition(parentGroupId, parentTransitionLogic).then((transition: any) => {
        const transitionToNodeId = transition.to;
        const startId = this.ProjectService.isGroupNode(transitionToNodeId)
          ? this.ProjectService.getGroupStartId(transitionToNodeId)
          : null;
        resolve(startId == null || startId === '' ? transitionToNodeId : startId);
      });
    }
  }
}
