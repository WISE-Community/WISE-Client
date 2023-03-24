import { Component, OnInit } from '@angular/core';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { temporarilyHighlightElement } from '../../../../common/dom/dom';

@Component({
  selector: 'node-advanced-constraint-authoring',
  templateUrl: 'node-advanced-constraint-authoring.component.html',
  styleUrls: ['node-advanced-constraint-authoring.component.scss']
})
export class NodeAdvancedConstraintAuthoringComponent implements OnInit {
  node: any;

  constructor(
    private dataService: TeacherDataService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit() {
    this.node = this.projectService.getNodeById(this.dataService.getCurrentNodeId());
    if (this.node.constraints == null) {
      this.node.constraints = [];
    }
  }

  protected addConstraintAndScrollToBottom(): void {
    const newNodeConstraintId = this.addConstraint();
    setTimeout(() => {
      this.projectService.scrollToBottomOfPage();
      temporarilyHighlightElement(newNodeConstraintId);
    });
  }

  private addConstraint(): string {
    const newNodeConstraintId = this.getNewNodeConstraintId();
    const constraint = {
      id: newNodeConstraintId,
      action: '',
      targetId: this.node.id,
      removalConditional: 'any',
      removalCriteria: [
        {
          name: '',
          params: {}
        }
      ]
    };
    this.node.constraints.push(constraint);
    this.saveProject();
    return newNodeConstraintId;
  }

  private getNewNodeConstraintId(): string {
    const usedConstraintIds = this.node.constraints.map((constraint) => constraint.id);
    let constraintCounter = 1;
    while (true) {
      const newConstraintId = `${this.node.id}Constraint${constraintCounter}`;
      if (!usedConstraintIds.includes(newConstraintId)) {
        return newConstraintId;
      } else {
        constraintCounter++;
      }
    }
  }

  protected deleteConstraint(constraintIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this constraint?`)) {
      this.node.constraints.splice(constraintIndex, 1);
      this.saveProject();
    }
  }

  protected saveProject(): void {
    this.projectService.saveProject();
  }
}
