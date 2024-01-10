import { Component } from '@angular/core';
import { ConstraintAction } from '../../../../../app/domain/constraintAction';
import { ConstraintAuthoringComponent } from '../constraint-authoring/constraint-authoring.component';

@Component({
  selector: 'component-constraint-authoring',
  templateUrl: '../constraint-authoring/constraint-authoring.component.html',
  styleUrls: ['../constraint-authoring/constraint-authoring.component.scss']
})
export class ComponentConstraintAuthoringComponent extends ConstraintAuthoringComponent {
  constraintActions = [
    new ConstraintAction('', $localize`Please Choose an Action`),
    new ConstraintAction('makeThisComponentNotVisible', $localize`Make This Component Not Visible`)
  ];
}
