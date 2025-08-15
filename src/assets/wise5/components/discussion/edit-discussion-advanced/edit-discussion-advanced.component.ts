import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditComponentMaxScoreComponent } from '../../../../../app/authoring-tool/edit-component-max-score/edit-component-max-score.component';
import { EditComponentExcludeFromTotalScoreComponent } from '../../../../../app/authoring-tool/edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { EditComponentWidthComponent } from '../../../../../app/authoring-tool/edit-component-width/edit-component-width.component';
import { EditComponentRubricComponent } from '../../../../../app/authoring-tool/edit-component-rubric/edit-component-rubric.component';
import { EditComponentTagsComponent } from '../../../../../app/authoring-tool/edit-component-tags/edit-component-tags.component';
import { EditDiscussionConnectedComponentsComponent } from '../edit-discussion-connected-components/edit-discussion-connected-components.component';
import { EditComponentConstraintsComponent } from '../../../../../app/authoring-tool/edit-component-constraints/edit-component-constraints.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';

@Component({
  templateUrl: 'edit-discussion-advanced.component.html',
  imports: [
    EditComponentMaxScoreComponent,
    EditComponentExcludeFromTotalScoreComponent,
    EditComponentWidthComponent,
    EditComponentRubricComponent,
    EditComponentTagsComponent,
    EditDiscussionConnectedComponentsComponent,
    EditComponentConstraintsComponent,
    EditComponentJsonComponent
  ]
})
export class EditDiscussionAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['Discussion'];
}
