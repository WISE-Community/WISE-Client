import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { ProjectService } from '../../../services/projectService';
import { UtilService } from '../../../services/utilService';
import { AuthorPeerGroupingDialogComponent } from '../author-peer-grouping-dialog/author-peer-grouping-dialog.component';
import {
  DIFFERENT_IDEAS_REGEX,
  DIFFERENT_IDEAS_VALUE,
  DIFFERENT_SCORES_REGEX,
  DIFFERENT_SCORES_VALUE
} from '../PeerGroupingLogic';
import { ReferenceComponent } from '../../../../../app/domain/referenceComponent';

@Component({
  selector: 'edit-peer-grouping-dialog',
  templateUrl: './edit-peer-grouping-dialog.component.html',
  styleUrls: ['./edit-peer-grouping-dialog.component.scss']
})
export class EditPeerGroupingDialogComponent extends AuthorPeerGroupingDialogComponent {
  stepsUsedIn: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public peerGrouping: PeerGrouping,
    protected dialogRef: MatDialogRef<EditPeerGroupingDialogComponent>,
    private peerGroupingAuthoringService: PeerGroupingAuthoringService,
    protected projectService: ProjectService,
    private utilService: UtilService
  ) {
    super(dialogRef, projectService);
  }

  ngOnInit(): void {
    this.peerGrouping = this.utilService.makeCopyOfJSONObject(this.peerGrouping);
    this.stepsUsedIn = this.peerGroupingAuthoringService.getStepsUsedIn(this.peerGrouping.tag);
    this.logicType = this.getLogicType(this.peerGrouping.logic);
    if (this.logicType === DIFFERENT_IDEAS_VALUE) {
      this.referenceComponent = this.getDifferentIdeasReferenceComponent(this.peerGrouping.logic);
    } else if (this.logicType === DIFFERENT_SCORES_VALUE) {
      this.referenceComponent = this.getDifferentScoresReferenceComponent(this.peerGrouping.logic);
      this.mode = this.getDifferentScoresMode(this.peerGrouping.logic);
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

  private getDifferentIdeasReferenceComponent(logic: string): ReferenceComponent {
    const result = new RegExp(DIFFERENT_IDEAS_REGEX).exec(logic);
    return new ReferenceComponent(result[1], result[2]);
  }

  private getDifferentScoresReferenceComponent(logic: string): ReferenceComponent {
    const result = new RegExp(DIFFERENT_SCORES_REGEX).exec(logic);
    return new ReferenceComponent(result[1], result[2]);
  }

  private getDifferentScoresMode(logic: string): string {
    const result = new RegExp(DIFFERENT_SCORES_REGEX).exec(logic);
    return result[4];
  }

  save(): void {
    this.updatePeerGroupingLogic();
    this.peerGroupingAuthoringService.updatePeerGrouping(this.peerGrouping).subscribe(() => {
      this.dialogRef.close();
    });
  }

  delete(): void {
    if (confirm($localize`Are you sure you want to delete this Peer Grouping?`)) {
      this.dialogRef.close(true);
    }
  }
}
