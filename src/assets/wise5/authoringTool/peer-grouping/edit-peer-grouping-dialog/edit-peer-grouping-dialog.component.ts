import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectStepAndComponentComponent } from '../../../../../app/authoring-tool/select-step-and-component/select-step-and-component.component';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { AuthorPeerGroupingDialogComponent } from '../author-peer-grouping-dialog/author-peer-grouping-dialog.component';
import {
  DIFFERENT_IDEAS_REGEX,
  DIFFERENT_IDEAS_VALUE,
  DIFFERENT_SCORES_REGEX,
  DIFFERENT_SCORES_VALUE
} from '../PeerGroupingLogic';

@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    SelectStepAndComponentComponent
  ],
  templateUrl: './edit-peer-grouping-dialog.component.html'
})
export class EditPeerGroupingDialogComponent extends AuthorPeerGroupingDialogComponent {
  @Inject(MAT_DIALOG_DATA) public peerGrouping = inject(MAT_DIALOG_DATA) as PeerGrouping;
  protected override dialogRef = inject(MatDialogRef<EditPeerGroupingDialogComponent>);
  private peerGroupingAuthoringService = inject(PeerGroupingAuthoringService);

  stepsUsedIn: string[] = [];

  ngOnInit(): void {
    this.peerGrouping = new PeerGrouping(this.peerGrouping);
    this.stepsUsedIn = this.peerGroupingAuthoringService.getStepsUsedIn(this.peerGrouping.tag);
    this.logicType = this.getLogicType(this.peerGrouping.logic);
    if (this.logicType === DIFFERENT_IDEAS_VALUE) {
      this.referenceComponent = this.peerGrouping.getDifferentIdeasReferenceComponent();
      this.mode = this.peerGrouping.getDifferentIdeasMode();
    } else if (this.logicType === DIFFERENT_SCORES_VALUE) {
      this.referenceComponent = this.peerGrouping.getDifferentScoresReferenceComponent();
      this.mode = this.peerGrouping.getDifferentScoresMode();
    }
  }

  private getLogicType(logic: string): string {
    if (new RegExp(DIFFERENT_IDEAS_REGEX).exec(logic) != null) {
      return DIFFERENT_IDEAS_VALUE;
    } else if (new RegExp(DIFFERENT_SCORES_REGEX).exec(logic) != null) {
      return DIFFERENT_SCORES_VALUE;
    } else {
      return logic;
    }
  }

  save(): void {
    this.updatePeerGroupingLogic();
    this.peerGroupingAuthoringService.updatePeerGrouping(this.peerGrouping).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: ({ error }) => {
        this.handleError(error);
      }
    });
  }

  delete(): void {
    if (confirm($localize`Are you sure you want to delete this Peer Grouping?`)) {
      this.dialogRef.close(true);
    }
  }
}
