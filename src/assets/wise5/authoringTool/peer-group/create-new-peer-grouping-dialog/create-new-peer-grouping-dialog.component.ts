import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PeerGroupAuthoringService } from '../../../services/peerGroupAuthoringService';
import { AuthorPeerGroupingComponent } from '../author-peer-grouping/author-peer-grouping.component';
import { PeerGroupSettings } from '../peerGroupSettings';

@Component({
  selector: 'app-create-new-peer-grouping-dialog',
  templateUrl: './create-new-peer-grouping-dialog.component.html',
  styleUrls: ['./create-new-peer-grouping-dialog.component.scss']
})
export class CreateNewPeerGroupingDialogComponent extends AuthorPeerGroupingComponent {
  constructor(
    private dialogRef: MatDialogRef<CreateNewPeerGroupingDialogComponent>,
    private peerGroupAuthoringService: PeerGroupAuthoringService
  ) {
    super();
  }

  ngOnInit(): void {
    this.peerGroupSettings = new PeerGroupSettings();
    this.peerGroupSettings.logic = 'random';
    this.peerGroupSettings.maxMembershipCount = 2;
  }

  create(): void {
    this.peerGroupSettings.tag = this.peerGroupAuthoringService.getUniqueTag();
    this.peerGroupAuthoringService
      .createNewPeerGroupSettings(this.peerGroupSettings)
      .subscribe(() => {
        this.dialogRef.close(this.peerGroupSettings);
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
