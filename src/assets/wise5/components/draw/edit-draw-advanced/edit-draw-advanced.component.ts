import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditComponentDefaultFeedback } from '../../../../../app/authoring-tool/edit-advanced-component/edit-component-default-feedback/edit-component-default-feedback.component';
import { EditComponentAddToNotebookButtonComponent } from '../../../../../app/authoring-tool/edit-component-add-to-notebook-button/edit-component-add-to-notebook-button.component';
import { EditComponentConstraintsComponent } from '../../../../../app/authoring-tool/edit-component-constraints/edit-component-constraints.component';
import { EditComponentExcludeFromTotalScoreComponent } from '../../../../../app/authoring-tool/edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';
import { EditComponentMaxScoreComponent } from '../../../../../app/authoring-tool/edit-component-max-score/edit-component-max-score.component';
import { EditComponentMaxSubmitComponent } from '../../../../../app/authoring-tool/edit-component-max-submit/edit-component-max-submit.component';
import { EditComponentRubricComponent } from '../../../../../app/authoring-tool/edit-component-rubric/edit-component-rubric.component';
import { EditComponentSaveButtonComponent } from '../../../../../app/authoring-tool/edit-component-save-button/edit-component-save-button.component';
import { EditComponentSubmitButtonComponent } from '../../../../../app/authoring-tool/edit-component-submit-button/edit-component-submit-button.component';
import { EditComponentTagsComponent } from '../../../../../app/authoring-tool/edit-component-tags/edit-component-tags.component';
import { EditComponentWidthComponent } from '../../../../../app/authoring-tool/edit-component-width/edit-component-width.component';
import { EditDrawConnectedComponentsComponent } from '../edit-draw-connected-components/edit-draw-connected-components.component';

@Component({
  templateUrl: 'edit-draw-advanced.component.html',
  imports: [
    EditComponentAddToNotebookButtonComponent,
    EditComponentSaveButtonComponent,
    EditComponentSubmitButtonComponent,
    EditComponentMaxSubmitComponent,
    EditComponentDefaultFeedback,
    EditComponentMaxScoreComponent,
    EditComponentExcludeFromTotalScoreComponent,
    EditComponentWidthComponent,
    EditComponentRubricComponent,
    EditComponentTagsComponent,
    EditDrawConnectedComponentsComponent,
    EditComponentConstraintsComponent,
    EditComponentJsonComponent
  ]
})
export class EditDrawAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['ConceptMap', 'Draw', 'Embedded', 'Graph', 'Label', 'Table'];
}
