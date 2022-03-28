import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PeerGroupSettingsAuthoringService } from '../../../services/peerGroupSettingsAuthoringService';
import { AuthorPeerGroupSettingsComponent } from '../author-peer-group-settings/author-peer-group-settings.component';
import { PeerGroupSettings } from '../peerGroupSettings';

@Component({
  selector: 'app-create-new-peer-group-settings-dialog',
  templateUrl: './create-new-peer-group-settings-dialog.component.html',
  styleUrls: ['./create-new-peer-group-settings-dialog.component.scss']
})
export class CreateNewPeerGroupSettingsDialogComponent extends AuthorPeerGroupSettingsComponent {
  constructor(
    private dialogRef: MatDialogRef<CreateNewPeerGroupSettingsDialogComponent>,
    private peerGroupSettingsAuthoringService: PeerGroupSettingsAuthoringService
  ) {
    super();
  }

  ngOnInit(): void {
    this.peerGroupSettings = new PeerGroupSettings();
    this.peerGroupSettings.logic = 'random';
    this.peerGroupSettings.maxMembershipCount = 2;
  }

  create(): void {
    this.peerGroupSettings.tag = this.peerGroupSettingsAuthoringService.getUniqueTag();
    this.peerGroupSettingsAuthoringService
      .createNewPeerGroupSettings(this.peerGroupSettings)
      .subscribe(() => {
        this.dialogRef.close(this.peerGroupSettings);
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
