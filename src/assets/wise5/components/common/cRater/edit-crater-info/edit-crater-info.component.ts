import { Component, Input } from '@angular/core';
import { CRaterRubric } from '../CRaterRubric';
import { EditCRaterDescriptionComponent } from '../edit-crater-description/edit-crater-description.component';
import { EditCRaterIdeaDescriptionsComponent } from '../edit-crater-idea-descriptions/edit-crater-idea-descriptions.component';

@Component({
  selector: 'edit-crater-info',
  imports: [EditCRaterDescriptionComponent, EditCRaterIdeaDescriptionsComponent],
  template: `<h5 class="!text-xl" i18n>AI Model Details</h5>
    <edit-crater-description [cRaterRubric]="cRaterRubric" />
    <edit-crater-idea-descriptions [ideaDescriptions]="cRaterRubric.ideas" />`
})
export class EditCRaterInfoComponent {
  @Input() cRaterRubric: CRaterRubric;
}
