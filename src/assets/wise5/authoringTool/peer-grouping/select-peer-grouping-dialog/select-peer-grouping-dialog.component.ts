import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { CreateNewPeerGroupingDialogComponent } from '../create-new-peer-grouping-dialog/create-new-peer-grouping-dialog.component';
import { SelectPeerGroupingOptionComponent } from '../select-peer-grouping-option/select-peer-grouping-option.component';

class SelectPeerGroupingDialogData {
  peerGrouping: PeerGrouping;
  updateSelectedTag: (tag: string) => void;
}

@Component({
  templateUrl: './select-peer-grouping-dialog.component.html',
  styles: ['.peer-grouping { margin-bottom: 8px; }'],
  imports: [
    MatDialogModule,
    CdkScrollable,
    MatCardModule,
    SelectPeerGroupingOptionComponent,
    MatButton,
    MatIcon
  ]
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
      panelClass: 'dialog-sm'
    });
  }

  deletePeerGrouping(peerGrouping: PeerGrouping): void {
    this.peerGroupingAuthoringService.deletePeerGrouping(peerGrouping);
  }
}
