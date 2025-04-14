import { Component, Inject } from '@angular/core';
import { CRaterRubric } from '../CRaterRubric';
import { CRaterIdea } from '../CRaterIdea';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
// import { IdeasSortingService }

@Component({
  imports: [MatIconModule],
  selector: 'crater-rubric',
  templateUrl: './crater-rubric.component.html',
  styleUrl: './crater-rubric.component.scss'
})
export class CRaterRubricComponent {
  protected ideas: CRaterIdea[];

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: { cRaterRubric: CRaterRubric },
    private dialogRef: MatDialogRef<CRaterRubricComponent>
  ) {}
  //   constructor(private ideasSortingService: IdeasSortingService) {}

  ngOnInit(): void {
    // this.ideas = this.ideasSortingService.sortById(this.cRaterRubric.getIdeas());
    this.ideas = this.data.cRaterRubric.getIdeas();
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }

  protected highlightButton(): void {}
}
