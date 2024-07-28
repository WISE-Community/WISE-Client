import { Component } from '@angular/core';
import { ConstraintAction } from '../../../../../app/domain/constraintAction';
import { ConstraintAuthoringComponent } from '../constraint-authoring/constraint-authoring.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EditConstraintRemovalCriteriaComponent } from '../edit-constraint-removal-criteria/edit-constraint-removal-criteria.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RequiredErrorLabelComponent } from '../../node/advanced/required-error-label/required-error-label.component';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  imports: [
    CommonModule,
    EditConstraintRemovalCriteriaComponent,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    RequiredErrorLabelComponent
  ],
  selector: 'node-constraint-authoring',
  standalone: true,
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
