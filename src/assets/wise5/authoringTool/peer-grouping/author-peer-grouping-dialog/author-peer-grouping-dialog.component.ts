import { Directive, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { AVAILABLE_LOGIC, PeerGroupingLogic } from '../PeerGroupingLogic';

@Directive()
export abstract class AuthorPeerGroupingDialogComponent implements OnInit {
  availableLogic: PeerGroupingLogic[];
  peerGrouping: PeerGrouping;

  constructor(protected dialogRef: MatDialogRef<AuthorPeerGroupingDialogComponent>) {
    this.availableLogic = AVAILABLE_LOGIC;
  }

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }
}
