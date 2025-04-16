import { Component, Inject, Injectable, signal } from '@angular/core';
import { CRaterIdea } from '../CRaterIdea';
import { cRaterIdeaToIdeaData, ideaDataToCRaterIdea } from '../IdeaData';
import { CRaterRubric } from '../CRaterRubric';
import { IdeasSortingService } from '../../../../services/ideasSortingService';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RubricEventService } from './RubricEventService';

@Component({
  imports: [MatIconModule],
  providers: [IdeasSortingService],
  selector: 'crater-rubric',
  templateUrl: './crater-rubric.component.html',
  styleUrl: './crater-rubric.component.scss'
})
export class CRaterRubricComponent {
  protected ideas: CRaterIdea[];

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: { cRaterRubric: CRaterRubric },
    private dialogRef: MatDialogRef<CRaterRubricComponent>,
    private ideasSortingService: IdeasSortingService,
    private rubricEventService: RubricEventService
  ) {}

  ngOnInit(): void {
    this.ideas = this.ideasSortingService
      .sortById(this.data.cRaterRubric.ideas.map(cRaterIdeaToIdeaData))
      .map(ideaDataToCRaterIdea);
  }

  protected closeDialog(): void {
    this.dialogRef.close();
    this.rubricEventService.emitRubricToggledEvent();
  }

  protected highlightButton(): void {}
}
