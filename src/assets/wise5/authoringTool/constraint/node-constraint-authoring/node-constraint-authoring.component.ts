import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ConstraintAction } from '../../../../../app/domain/constraintAction';
import { RequiredErrorLabelComponent } from '../../node/advanced/required-error-label/required-error-label.component';
import { ConstraintAuthoringComponent } from '../constraint-authoring/constraint-authoring.component';
import { EditConstraintRemovalCriteriaComponent } from '../edit-constraint-removal-criteria/edit-constraint-removal-criteria.component';

@Component({
  imports: [
    CommonModule,
    EditConstraintRemovalCriteriaComponent,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    RequiredErrorLabelComponent
  ],
  selector: 'node-constraint-authoring',
  styleUrl: '../constraint-authoring/constraint-authoring.component.scss',
  templateUrl: '../constraint-authoring/constraint-authoring.component.html'
})
export class NodeConstraintAuthoringComponent extends ConstraintAuthoringComponent {
  constraintActions = [
    new ConstraintAction('', $localize`Please Choose an Action`),
    new ConstraintAction(
      'makeAllNodesAfterThisNotVisitable',
      $localize`Make all nodes after this not visitable`
    ),
    new ConstraintAction(
      'makeAllNodesAfterThisNotVisible',
      $localize`Make all nodes after this not visible`
    ),
    new ConstraintAction(
      'makeAllOtherNodesNotVisitable',
      $localize`Make all other nodes not visitable`
    ),
    new ConstraintAction(
      'makeAllOtherNodesNotVisible',
      $localize`Make all other nodes not visible`
    ),
    new ConstraintAction('makeThisNodeNotVisitable', $localize`Make this node not visitable`),
    new ConstraintAction('makeThisNodeNotVisible', $localize`Make this node not visible`)
  ];
}
