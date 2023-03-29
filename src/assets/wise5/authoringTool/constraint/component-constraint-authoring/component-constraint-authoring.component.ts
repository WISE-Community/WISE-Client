import { Component } from '@angular/core';
import { ValueAndText } from '../../../../../app/domain/valueAndText';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConstraintAuthoringComponent } from '../constraint-authoring/constraint-authoring.component';

@Component({
  selector: 'component-constraint-authoring',
  templateUrl: '../constraint-authoring/constraint-authoring.component.html',
  styleUrls: ['../constraint-authoring/constraint-authoring.component.scss']
})
export class ComponentConstraintAuthoringComponent extends ConstraintAuthoringComponent {
  constraintActions = [
    new ValueAndText('', $localize`Please Choose an Action`),
    new ValueAndText('makeThisComponentNotVisible', $localize`Make This Component Not Visible`)
  ];

  constructor(
    protected dataService: TeacherDataService,
    protected projectService: TeacherProjectService
  ) {
    super(dataService, projectService);
  }
}
