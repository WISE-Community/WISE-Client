import { Directive, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { availableLogic, PeerGroupingLogic } from '../PeerGroupingLogic';

@Directive()
export abstract class AuthorPeerGroupingDialogComponent implements OnInit {
  availableLogic: PeerGroupingLogic[];
  peerGrouping: PeerGrouping;

  constructor(protected dialogRef: MatDialogRef<AuthorPeerGroupingDialogComponent>) {
    this.availableLogic = availableLogic;
  }

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }
}
