import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { UtilService } from '../../../services/utilService';
import { AuthorPeerGroupingComponent } from '../author-peer-group-settings/author-peer-grouping.component';

@Component({
  selector: 'edit-peer-grouping-dialog',
  templateUrl: './edit-peer-grouping-dialog.component.html',
  styleUrls: ['./edit-peer-grouping-dialog.component.scss']
})
export class EditPeerGroupingDialogComponent extends AuthorPeerGroupingComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public peerGrouping: any,
    private dialogRef: MatDialogRef<EditPeerGroupingDialogComponent>,
    private peerGroupingAuthoringService: PeerGroupingAuthoringService,
    private utilService: UtilService
  ) {
    super();
  }

  ngOnInit(): void {
    this.peerGroupSettings = this.utilService.makeCopyOfJSONObject(
      this.peerGrouping.peerGroupSettings
    );
  }

  save(): void {
    this.peerGrouping.peerGroupSettings = this.peerGroupSettings;
    this.peerGroupingAuthoringService
      .updatePeerGroupSettings(this.peerGroupSettings)
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  delete(): void {
    if (confirm($localize`Are you sure you want to delete this Peer Grouping?`)) {
      this.dialogRef.close(true);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
