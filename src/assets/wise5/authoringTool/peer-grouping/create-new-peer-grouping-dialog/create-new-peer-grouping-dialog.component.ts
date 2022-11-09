import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { AuthorPeerGroupingDialogComponent } from '../author-peer-grouping-dialog/author-peer-grouping-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../../services/projectService';

@Component({
  selector: 'create-new-peer-grouping-dialog',
  templateUrl: './create-new-peer-grouping-dialog.component.html',
  styleUrls: ['./create-new-peer-grouping-dialog.component.scss']
})
export class CreateNewPeerGroupingDialogComponent extends AuthorPeerGroupingDialogComponent {
  constructor(
    protected dialogRef: MatDialogRef<CreateNewPeerGroupingDialogComponent>,
    private peerGroupingAuthoringService: PeerGroupingAuthoringService,
    protected projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {
    super(dialogRef, projectService);
  }

  ngOnInit(): void {
    this.peerGrouping = new PeerGrouping({ logic: 'random', maxMembershipCount: 2 });
  }

  create(): Subscription {
    this.peerGrouping.tag = this.peerGroupingAuthoringService.getUniqueTag();
    this.updatePeerGroupingLogic();
    return this.peerGroupingAuthoringService.createNewPeerGrouping(this.peerGrouping).subscribe(
      () => {
        this.dialogRef.close();
      },
      () => {
        this.snackBar.open($localize`Please Try Again (Error: Duplicate Tag)`);
      }
    );
  }
}
