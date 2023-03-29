import { Component } from '@angular/core';
import { ValueAndText } from '../../../../../app/domain/valueAndText';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConstraintAuthoringComponent } from '../constraint-authoring/constraint-authoring.component';

@Component({
  selector: 'node-constraint-authoring',
  templateUrl: '../constraint-authoring/constraint-authoring.component.html',
  styleUrls: ['../constraint-authoring/constraint-authoring.component.scss']
})
export class NodeConstraintAuthoringComponent extends ConstraintAuthoringComponent {
  constraintActions = [
    new ValueAndText('', $localize`Please Choose an Action`),
    new ValueAndText(
      'makeAllNodesAfterThisNotVisitable',
      $localize`Make all nodes after this not visitable`
    ),
    new ValueAndText(
      'makeAllNodesAfterThisNotVisible',
      $localize`Make all nodes after this not visible`
    ),
    new ValueAndText(
      'makeAllOtherNodesNotVisitable',
      $localize`Make all other nodes not visitable`
    ),
    new ValueAndText('makeAllOtherNodesNotVisible', $localize`Make all other nodes not visible`),
    new ValueAndText('makeThisNodeNotVisitable', $localize`Make this node not visitable`),
    new ValueAndText('makeThisNodeNotVisible', $localize`Make this node not visible`)
  ];

  constructor(
    protected dataService: TeacherDataService,
    protected projectService: TeacherProjectService
  ) {
    super(dataService, projectService);
  }
}
