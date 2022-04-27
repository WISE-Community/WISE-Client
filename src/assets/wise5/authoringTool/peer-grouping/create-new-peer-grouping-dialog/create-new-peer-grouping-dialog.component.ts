import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { AuthorPeerGroupingComponent } from '../author-peer-grouping-settings/author-peer-grouping.component';
import { PeerGroupingSettings } from '../peerGroupingSettings';

@Component({
  selector: 'create-new-peer-grouping-dialog',
  templateUrl: './create-new-peer-grouping-dialog.component.html',
  styleUrls: ['./create-new-peer-grouping-dialog.component.scss']
})
export class CreateNewPeerGroupingDialogComponent extends AuthorPeerGroupingComponent {
  constructor(
    private dialogRef: MatDialogRef<CreateNewPeerGroupingDialogComponent>,
    private peerGroupingAuthoringService: PeerGroupingAuthoringService
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = new PeerGroupingSettings();
    this.settings.logic = 'random';
    this.settings.maxMembershipCount = 2;
  }

  create(): void {
    this.settings.tag = this.peerGroupingAuthoringService.getUniqueTag();
    this.peerGroupingAuthoringService.createNewPeerGroupingSettings(this.settings).subscribe(() => {
      this.dialogRef.close(this.settings);
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
