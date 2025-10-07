import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [
    MatDialogTitle,
    MatIcon,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  selector: 'app-peer-group-move-workgroup-confirm-dialog',
  styleUrl: './peer-group-move-workgroup-confirm-dialog.component.scss',
  templateUrl: './peer-group-move-workgroup-confirm-dialog.component.html'
})
export class PeerGroupMoveWorkgroupConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public isMovingFromPeerGroup: boolean) {}
}
