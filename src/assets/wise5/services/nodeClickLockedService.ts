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
        const nodeTitle = this.projectService.getNodePositionAndTitleByNodeId(nodeId);
        message = $localize`<p>To visit <b>${nodeTitle}</b> you need to:</p><ul>`;
        this.projectService.orderConstraints(constraints);
        for (const constraint of constraints) {
          if (!this.studentDataService.evaluateConstraint(constraint)) {
            message += `<li>${this.projectService.getConstraintMessage(nodeId, constraint)}</li>`;
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
}
