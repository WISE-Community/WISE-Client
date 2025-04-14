import { Component, Input } from '@angular/core';
import { EditCRaterDescriptionComponent } from '../edit-crater-description/edit-crater-description.component';
import { EditCRaterIdeaDescriptionsComponent } from '../edit-crater-idea-descriptions/edit-crater-idea-descriptions.component';
import { MatCardModule } from '@angular/material/card';
import { CRaterIdea } from '../CRaterIdea';

@Component({
  selector: 'edit-crater-info',
  imports: [EditCRaterDescriptionComponent, EditCRaterIdeaDescriptionsComponent, MatCardModule],
  templateUrl: './edit-crater-info.component.html',
  styleUrl: './edit-crater-info.component.scss'
})
export class EditCRaterInfoComponent {
  @Input() description: string;
  @Input() ideaDescriptions: CRaterIdea[];
}
