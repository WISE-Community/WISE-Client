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
    let message = $localize`Sorry, you cannot view this item yet.`;
    const node = this.projectService.getNodeById(nodeId);
    const constraints = this.constraintService.getConstraintsThatAffectNode(node);
    if (constraints.length > 0) {
      const nodeTitle = this.projectService.getNodePositionAndTitle(nodeId);
      message = $localize`<p>To visit <b>${nodeTitle}</b> you need to:</p><ul>`;
      this.constraintService.orderConstraints(constraints);
      for (const constraint of constraints) {
        if (!this.constraintService.evaluateConstraint(constraint)) {
          message += `<li>${this.getConstraintMessage(constraint)}</li>`;
        }
      }
      message += `</ul>`;
    }
    this.dialog.open(DialogWithCloseComponent, {
      data: {
        content: message,
        title: $localize`Item Locked`
      }
    });
  }

  /**
   * Get the message that describes how to disable the constraint
   * @param constraint the constraint that is preventing the student from going to the node
   * @returns the message to display to the student that describes how to disable the constraint
   */
  private getConstraintMessage(constraint: Constraint): string {
    let message = '';
    for (const criterion of constraint.removalCriteria) {
      const criteriaMessage = this.projectService.getCriteriaMessage(criterion);
      if (criteriaMessage != '') {
        if (message != '') {
          message += '<br/>';
        }
        message += criteriaMessage;
      }
    }
    return message;
  }
}
