import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-peer-group-move-workgroup-confirm-dialog',
  templateUrl: './peer-group-move-workgroup-confirm-dialog.component.html',
  styleUrl: './peer-group-move-workgroup-confirm-dialog.component.scss',
  standalone: false
})
export class PeerGroupMoveWorkgroupConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public isMovingFromPeerGroup: boolean) {}
}
