import { Component } from '@angular/core';
import { ConstraintAction } from '../../../../../app/domain/constraintAction';
import { ConstraintAuthoringComponent } from '../constraint-authoring/constraint-authoring.component';

@Component({
  selector: 'node-constraint-authoring',
  templateUrl: '../constraint-authoring/constraint-authoring.component.html',
  styleUrls: ['../constraint-authoring/constraint-authoring.component.scss']
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
