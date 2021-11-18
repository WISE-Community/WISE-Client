import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-peer-group-move-workgroup-confirm-dialog',
  templateUrl: './peer-group-move-workgroup-confirm-dialog.component.html',
  styleUrls: ['./peer-group-move-workgroup-confirm-dialog.component.scss']
})
export class PeerGroupMoveWorkgroupConfirmDialogComponent implements OnInit {
  isMovingFromPeerGroup: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.isMovingFromPeerGroup = data.isMovingFromPeerGroup;
  }

  ngOnInit(): void {}
}
