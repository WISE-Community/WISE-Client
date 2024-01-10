import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogWithCloseComponent } from '../directives/dialog-with-close/dialog-with-close.component';
import { ProjectService } from './projectService';
import { StudentDataService } from './studentDataService';

@Injectable()
export class NodeClickLockedService {
  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private studentDataService: StudentDataService
  ) {}

  initialize(): void {
    this.studentDataService.nodeClickLocked$.subscribe(({ nodeId }) => {
      let message = $localize`Sorry, you cannot view this item yet.`;
      const node = this.projectService.getNodeById(nodeId);
      const constraints = this.projectService.getConstraintsThatAffectNode(node);
      if (constraints.length > 0) {
        const nodeTitle = this.projectService.getNodePositionAndTitle(nodeId);
        message = $localize`<p>To visit <b>${nodeTitle}</b> you need to:</p><ul>`;
        this.projectService.orderConstraints(constraints);
        for (const constraint of constraints) {
          if (!this.studentDataService.evaluateConstraint(constraint)) {
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
    });
  }

  /**
   * Get the message that describes how to disable the constraint
   * @param constraint the constraint that is preventing the student from going to the node
   * @returns the message to display to the student that describes how to disable the constraint
   */
  private getConstraintMessage(constraint: any): string {
    let message = '';
    const removalCriteria = constraint.removalCriteria;
    if (removalCriteria != null) {
      let criteriaMessages = '';
      for (let criterion of removalCriteria) {
        if (criterion != null) {
          const criteriaMessage = this.projectService.getCriteriaMessage(criterion);
          if (criteriaMessage != null && criteriaMessage != '') {
            if (criteriaMessages != '') {
              criteriaMessages += '<br/>';
            }
            criteriaMessages += criteriaMessage;
          }
        }
      }
      message = criteriaMessages;
    }
    return message;
  }
}
