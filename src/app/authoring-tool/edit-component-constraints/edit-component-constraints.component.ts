import { Component, Input, OnInit } from '@angular/core';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { Constraint } from '../../domain/constraint';

@Component({
  selector: 'edit-component-constraints',
  templateUrl: './edit-component-constraints.component.html',
  styleUrls: ['./edit-component-constraints.component.scss']
})
export class EditComponentConstraintsComponent implements OnInit {
  @Input() componentContent: any;

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    if (this.componentContent.constraints == null) {
      this.componentContent.constraints = [];
    }
  }

  protected addConstraint(): string {
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
    this.componentContent.constraints.push(constraint);
    this.saveProject();
    return newNodeConstraintId;
  }

  private getNewNodeConstraintId(): string {
    const usedConstraintIds = this.componentContent.constraints.map((constraint) => constraint.id);
    let constraintCounter = 1;
    while (true) {
      const newConstraintId = `${this.componentContent.id}Constraint${constraintCounter}`;
      if (!usedConstraintIds.includes(newConstraintId)) {
        return newConstraintId;
      } else {
        constraintCounter++;
      }
    }
  }

  protected deleteConstraint(constraintIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this constraint?`)) {
      this.componentContent.constraints.splice(constraintIndex, 1);
      this.saveProject();
    }
  }

  protected saveProject(): void {
    this.projectService.saveProject();
  }
}
