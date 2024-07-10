import { Component } from '@angular/core';
import { ConstraintAction } from '../../../../../app/domain/constraintAction';
import { ConstraintAuthoringComponent } from '../constraint-authoring/constraint-authoring.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RequiredErrorLabelComponent } from '../../node/advanced/required-error-label/required-error-label.component';
import { EditConstraintRemovalCriteriaComponent } from '../edit-constraint-removal-criteria/edit-constraint-removal-criteria.component';

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
  selector: 'component-constraint-authoring',
  standalone: true,
  styleUrl: '../constraint-authoring/constraint-authoring.component.scss',
  templateUrl: '../constraint-authoring/constraint-authoring.component.html'
})
export class ComponentConstraintAuthoringComponent extends ConstraintAuthoringComponent {
  constraintActions = [
    new ConstraintAction('', $localize`Please Choose an Action`),
    new ConstraintAction('makeThisComponentNotVisible', $localize`Make This Component Not Visible`)
  ];
}
