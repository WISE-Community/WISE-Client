import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { MatchContent } from '../MatchContent';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { EditComponentSaveButtonComponent } from '../../../../../app/authoring-tool/edit-component-save-button/edit-component-save-button.component';
import { EditComponentSubmitButtonComponent } from '../../../../../app/authoring-tool/edit-component-submit-button/edit-component-submit-button.component';
import { EditComponentMaxSubmitComponent } from '../../../../../app/authoring-tool/edit-component-max-submit/edit-component-max-submit.component';
import { EditComponentDefaultFeedback } from '../../../../../app/authoring-tool/edit-advanced-component/edit-component-default-feedback/edit-component-default-feedback.component';
import { EditComponentMaxScoreComponent } from '../../../../../app/authoring-tool/edit-component-max-score/edit-component-max-score.component';
import { EditComponentExcludeFromTotalScoreComponent } from '../../../../../app/authoring-tool/edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { EditComponentWidthComponent } from '../../../../../app/authoring-tool/edit-component-width/edit-component-width.component';
import { EditComponentRubricComponent } from '../../../../../app/authoring-tool/edit-component-rubric/edit-component-rubric.component';
import { EditComponentTagsComponent } from '../../../../../app/authoring-tool/edit-component-tags/edit-component-tags.component';
import { EditMatchConnectedComponentsComponent } from '../edit-match-connected-components/edit-match-connected-components.component';
import { EditComponentConstraintsComponent } from '../../../../../app/authoring-tool/edit-component-constraints/edit-component-constraints.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';

@Component({
  templateUrl: 'edit-match-advanced.component.html',
  styles: ['.checkbox { margin-top: 4px; margin-bottom: 4px; }'],
  imports: [
    MatCheckbox,
    FormsModule,
    EditComponentSaveButtonComponent,
    EditComponentSubmitButtonComponent,
    EditComponentMaxSubmitComponent,
    EditComponentDefaultFeedback,
    EditComponentMaxScoreComponent,
    EditComponentExcludeFromTotalScoreComponent,
    EditComponentWidthComponent,
    EditComponentRubricComponent,
    EditComponentTagsComponent,
    EditMatchConnectedComponentsComponent,
    EditComponentConstraintsComponent,
    EditComponentJsonComponent
  ]
})
export class EditMatchAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['DialogGuidance', 'Match'];
  componentContent: MatchContent;
}
