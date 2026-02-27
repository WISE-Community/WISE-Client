import { Component, Inject } from '@angular/core';
import { CRaterIdea } from '../CRaterIdea';
import { cRaterIdeaToIdeaData, IdeaData, sortIdeasById } from '../IdeaData';
import { CRaterRubric } from '../CRaterRubric';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RubricEventService } from './RubricEventService';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  selector: 'crater-rubric',
  templateUrl: './crater-rubric.component.html',
  styleUrl: './crater-rubric.component.scss'
})
export class CRaterRubricComponent {
  protected ideas: CRaterIdea[];

  constructor(
    @Inject(MAT_DIALOG_DATA) protected cRaterRubric: CRaterRubric,
    private dialogRef: MatDialogRef<CRaterRubricComponent>,
    private rubricEventService: RubricEventService
  ) {}

  ngOnInit(): void {
    this.ideas = sortIdeasById(this.cRaterRubric.ideas.map(cRaterIdeaToIdeaData)).map(
      (idea: IdeaData) => new CRaterIdea(idea.id, undefined, idea.text, idea.tags)
    );
    this.rubricEventService.toggleRubricDisplayed();
  }

  ngOnDestroy(): void {
    this.rubricEventService.toggleRubricDisplayed();
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }
}
