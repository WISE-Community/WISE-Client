import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGroupSettingsAuthoringService } from '../../../services/peerGroupSettingsAuthoringService';
import { CreateNewPeerGroupSettingsDialogComponent } from '../create-new-peer-group-settings-dialog/create-new-peer-group-settings-dialog.component';
import { PeerGroupSettings } from '../peerGroupSettings';

@Component({
  selector: 'select-peer-grouping-dialog',
  templateUrl: './select-peer-group-settings-dialog.component.html',
  styleUrls: ['./select-peer-group-settings-dialog.component.scss']
})
export class SelectPeerGroupSettingsDialogComponent implements OnInit {
  peerGroupings: any[] = [];

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SelectPeerGroupSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private selectedPeerGroupSettingsTag: string,
    private peerGroupSettingsAuthoringService: PeerGroupSettingsAuthoringService
  ) {}

  ngOnInit(): void {
    this.peerGroupSettingsAuthoringService.getPeerGroupSettings().forEach((peerGroupSettings) => {
      this.peerGroupings.push({
        peerGroupSettings: peerGroupSettings,
        stepsUsedIn: this.peerGroupSettingsAuthoringService.getStepsUsedIn(peerGroupSettings.tag)
      });
    });
  }

  addPeerGroupSettings(peerGroupSettingsToAdd: PeerGroupSettings): void {
    this.peerGroupings.push({
      peerGroupSettings: peerGroupSettingsToAdd,
      stepsUsedIn: this.peerGroupSettingsAuthoringService.getStepsUsedIn(peerGroupSettingsToAdd.tag)
    });
  }

  selectPeerGroupSettings(tag: string): void {
    this.selectedPeerGroupSettingsTag = tag;
  }

  save(): void {
    this.dialogRef.close(this.selectedPeerGroupSettingsTag);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  showNewPeerGroupSettingsAuthoring(): void {
    this.dialog
      .open(CreateNewPeerGroupSettingsDialogComponent, {
        width: '40%'
      })
      .afterClosed()
      .subscribe((peerGroupSettings: PeerGroupSettings) => {
        if (peerGroupSettings != null) {
          this.addPeerGroupSettings(peerGroupSettings);
        }
      });
  }

  deletePeerGroupSettings(tag: string): void {
    for (let p = 0; p < this.peerGroupings.length; p++) {
      const peerGrouping = this.peerGroupings[p];
      if (peerGrouping.peerGroupSettings.tag === tag) {
        this.peerGroupings.splice(p, 1);
        break;
      }
    }
    this.peerGroupSettingsAuthoringService.deletePeerGroupSettings(tag);
  }
}
