import { Directive, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';

@Directive()
export abstract class AuthorPeerGroupingDialogComponent implements OnInit {
  availableLogic: any[] = [
    { name: 'Random', value: 'random' },
    { name: 'Manual', value: 'manual' }
  ];
  peerGrouping: PeerGrouping;

  constructor(protected dialogRef: MatDialogRef<AuthorPeerGroupingDialogComponent>) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }
}
