import { Component, Input } from '@angular/core';
import { scrollToElement, temporarilyHighlightElement } from '../../../../common/dom/dom';
import { ConstraintsAuthoringComponent } from '../../../constraint/constraints-authoring/constraints-authoring.component';
import { Constraint } from '../../../../../../app/domain/constraint';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NodeConstraintAuthoringComponent } from '../../../constraint/node-constraint-authoring/node-constraint-authoring.component';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    NodeConstraintAuthoringComponent
  ],
  selector: 'node-advanced-constraint-authoring',
  styleUrl: 'node-advanced-constraint-authoring.component.scss',
  templateUrl: 'node-advanced-constraint-authoring.component.html'
})
export class NodeAdvancedConstraintAuthoringComponent extends ConstraintsAuthoringComponent {
  @Input() node: any;

  ngOnInit(): void {
    if (this.node.constraints == null) {
      this.node.constraints = [];
    }
    this.content = this.node;
  }

  protected addConstraint(): Constraint {
    const constraint = super.addConstraint();
    constraint.targetId = this.content.id;
    setTimeout(() => {
      scrollToElement('bottom');
      temporarilyHighlightElement(constraint.id);
    });
    return constraint;
  }
}
