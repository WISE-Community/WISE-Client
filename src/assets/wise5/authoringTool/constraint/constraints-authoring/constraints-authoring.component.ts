import { Directive } from '@angular/core';
import { Constraint } from '../../../../../app/domain/constraint';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Directive()
export class ConstraintsAuthoringComponent {
  content: any;

  constructor(protected projectService: TeacherProjectService) {}

  protected addConstraint(): Constraint {
    const newNodeConstraintId = this.getNewNodeConstraintId();
    const constraint = new Constraint({
      id: newNodeConstraintId,
      action: '',
      removalConditional: 'any',
      removalCriteria: [
        {
          name: '',
          params: {}
        }
      ]
    });
    this.content.constraints.push(constraint);
    this.saveProject();
    return constraint;
  }

  private getNewNodeConstraintId(): string {
    const usedConstraintIds = this.content.constraints.map(
      (constraint: Constraint) => constraint.id
    );
    let constraintCounter = 1;
    while (true) {
      const newConstraintId = `${this.content.id}Constraint${constraintCounter}`;
      if (!usedConstraintIds.includes(newConstraintId)) {
        return newConstraintId;
      } else {
        constraintCounter++;
      }
    }
  }

  protected deleteConstraint(constraintIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this constraint?`)) {
      this.content.constraints.splice(constraintIndex, 1);
      this.saveProject();
    }
  }

  protected saveProject(): void {
    this.projectService.saveProject();
  }
}
