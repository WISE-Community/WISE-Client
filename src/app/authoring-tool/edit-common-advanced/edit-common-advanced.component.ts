import { Component, Input } from '@angular/core';
import { Component as WISEComponent } from '../../../assets/wise5/common/Component';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { EditConnectedComponentsComponent } from '../edit-connected-components/edit-connected-components.component';
import { EditComponentWidthComponent } from '../edit-component-width/edit-component-width.component';
import { EditComponentTagsComponent } from '../edit-component-tags/edit-component-tags.component';
import { EditComponentSaveButtonComponent } from '../edit-component-save-button/edit-component-save-button.component';
import { EditComponentSubmitButtonComponent } from '../edit-component-submit-button/edit-component-submit-button.component';
import { EditComponentRubricComponent } from '../edit-component-rubric/edit-component-rubric.component';
import { EditComponentJsonComponent } from '../edit-component-json/edit-component-json.component';
import { EditComponentMaxSubmitComponent } from '../edit-component-max-submit/edit-component-max-submit.component';
import { EditComponentMaxScoreComponent } from '../edit-component-max-score/edit-component-max-score.component';
import { EditComponentExcludeFromTotalScoreComponent } from '../edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { EditComponentDefaultFeedback } from '../edit-advanced-component/edit-component-default-feedback/edit-component-default-feedback.component';
import { EditComponentConstraintsComponent } from '../edit-component-constraints/edit-component-constraints.component';

@Component({
  imports: [
    EditComponentConstraintsComponent,
    EditComponentDefaultFeedback,
    EditComponentExcludeFromTotalScoreComponent,
    EditComponentMaxScoreComponent,
    EditComponentMaxSubmitComponent,
    EditComponentJsonComponent,
    EditComponentRubricComponent,
    EditComponentSaveButtonComponent,
    EditComponentSubmitButtonComponent,
    EditComponentTagsComponent,
    EditComponentWidthComponent,
    EditConnectedComponentsComponent
  ],
  selector: 'edit-common-advanced',
  templateUrl: './edit-common-advanced.component.html'
})
export class EditCommonAdvancedComponent {
  @Input() allowedConnectedComponentTypes: string[] = [];
  @Input() component: WISEComponent;

  constructor(protected projectService: TeacherProjectService) {}

  protected connectedComponentsChanged(connectedComponents: any[]): void {
    this.component.content.connectedComponents = connectedComponents;
    this.projectService.nodeChanged();
  }
}
