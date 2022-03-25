import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGroupAuthoringService } from '../../../services/peerGroupAuthoringService';
import { UtilService } from '../../../services/utilService';
import { PeerGroupSettings } from '../peerGroupSettings';

@Component({
  selector: 'app-edit-peer-grouping-dialog',
  templateUrl: './edit-peer-grouping-dialog.component.html',
  styleUrls: ['./edit-peer-grouping-dialog.component.scss']
})
export class EditPeerGroupingDialogComponent implements OnInit {
  availableLogic: any[] = [
    { name: 'Random', value: 'random' },
    { name: 'Manual', value: 'manual' }
  ];

  @Input()
  peerGrouping: any;

  peerGroupSettings: PeerGroupSettings;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditPeerGroupingDialogComponent>,
    protected peerGroupAuthoringService: PeerGroupAuthoringService,
    private utilService: UtilService
  ) {
    this.peerGrouping = this.data.peerGrouping;
  }

  ngOnInit(): void {
    this.peerGroupSettings = this.utilService.makeCopyOfJSONObject(
      this.peerGrouping.peerGroupSettings
    );
  }

  save(): void {
    this.peerGrouping.peerGroupSettings = this.peerGroupSettings;
    this.peerGroupAuthoringService.updatePeerGroupSettings(this.peerGroupSettings).subscribe(() => {
      // this.updateEvent.emit();
      this.dialogRef.close();
    });
  }

  delete(): void {
    if (confirm($localize`Are you sure you want to delete this Peer Grouping?`)) {
      // this.deletePeerGroupingEvent.emit(this.peerGrouping.peerGroupSettings.tag);
      this.dialogRef.close(true);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
