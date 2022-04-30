import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { AuthorPeerGroupingComponent } from '../author-peer-grouping-settings/author-peer-grouping.component';

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
    this.peerGrouping = new PeerGrouping({ logic: 'random', maxMembershipCount: 2 });
  }

  create(): Subscription {
    this.peerGrouping.tag = this.peerGroupingAuthoringService.getUniqueTag();
    return this.peerGroupingAuthoringService
      .createNewPeerGrouping(this.peerGrouping)
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
