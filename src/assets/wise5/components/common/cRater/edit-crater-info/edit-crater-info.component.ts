import { Component, Input } from '@angular/core';
import { CRaterRubric } from '../CRaterRubric';
import { EditCRaterDescriptionComponent } from '../edit-crater-description/edit-crater-description.component';
import { EditCRaterIdeaDescriptionsComponent } from '../edit-crater-idea-descriptions/edit-crater-idea-descriptions.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'edit-crater-info',
  imports: [EditCRaterDescriptionComponent, EditCRaterIdeaDescriptionsComponent, MatCardModule],
  styles: ['.wrapper { padding: 16px; }'],
  template: `<mat-card appearance="outlined" class="wrapper">
    <h5 class="gap-1 !text-xl">
      <span i18n>Edit CRater Information</span>
    </h5>
    <edit-crater-description [cRaterRubric]="cRaterRubric" />
    <edit-crater-idea-descriptions [ideaDescriptions]="cRaterRubric.ideas" />
  </mat-card>`
})
export class EditCRaterInfoComponent {
  @Input() cRaterRubric: CRaterRubric;
}
