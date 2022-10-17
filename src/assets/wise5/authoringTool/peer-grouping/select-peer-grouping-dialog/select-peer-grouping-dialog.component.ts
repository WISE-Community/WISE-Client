import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { CreateNewPeerGroupingDialogComponent } from '../create-new-peer-grouping-dialog/create-new-peer-grouping-dialog.component';

class SelectPeerGroupingDialogData {
  peerGrouping: PeerGrouping;
  updateSelectedTag: (tag: string) => void;
}

@Component({
  selector: 'select-peer-grouping-dialog',
  templateUrl: './select-peer-grouping-dialog.component.html',
  styleUrls: ['./select-peer-grouping-dialog.component.scss']
})
export class SelectPeerGroupingDialogComponent implements OnInit {
  peerGroupings: PeerGrouping[] = [];

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SelectPeerGroupingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: SelectPeerGroupingDialogData,
    private peerGroupingAuthoringService: PeerGroupingAuthoringService
  ) {}

  ngOnInit(): void {
    this.peerGroupings = this.peerGroupingAuthoringService.getPeerGroupings();
  }

  selectPeerGrouping(peerGrouping: PeerGrouping): void {
    this.dialogData.peerGrouping = peerGrouping;
    this.dialogData.updateSelectedTag(peerGrouping.tag);
  }

  close(): void {
    this.dialogRef.close();
  }

  showNewPeerGroupingAuthoring(): void {
    this.dialog.open(CreateNewPeerGroupingDialogComponent, {
      panelClass: 'dialog-md'
    });
  }

  deletePeerGrouping(peerGrouping: PeerGrouping): void {
    this.peerGroupingAuthoringService.deletePeerGrouping(peerGrouping);
  }
}
