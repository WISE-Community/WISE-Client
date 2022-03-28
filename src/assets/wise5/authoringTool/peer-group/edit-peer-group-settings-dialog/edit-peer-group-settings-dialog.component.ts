import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGroupSettingsAuthoringService } from '../../../services/peerGroupSettingsAuthoringService';
import { UtilService } from '../../../services/utilService';
import { AuthorPeerGroupSettingsComponent } from '../author-peer-group-settings/author-peer-group-settings.component';

@Component({
  selector: 'app-edit-peer-group-settings-dialog',
  templateUrl: './edit-peer-group-settings-dialog.component.html',
  styleUrls: ['./edit-peer-group-settings-dialog.component.scss']
})
export class EditPeerGroupSettingsDialogComponent extends AuthorPeerGroupSettingsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public peerGrouping: any,
    private dialogRef: MatDialogRef<EditPeerGroupSettingsDialogComponent>,
    private peerGroupSettingsAuthoringService: PeerGroupSettingsAuthoringService,
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
    this.peerGroupSettingsAuthoringService
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
