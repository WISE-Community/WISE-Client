import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { CreateNewPeerGroupingDialogComponent } from '../create-new-peer-grouping-dialog/create-new-peer-grouping-dialog.component';
import { PeerGroupSettings } from '../peerGroupSettings';

@Component({
  selector: 'select-peer-grouping-dialog',
  templateUrl: './select-peer-grouping-dialog.component.html',
  styleUrls: ['./select-peer-grouping-dialog.component.scss']
})
export class SelectPeerGroupingDialogComponent implements OnInit {
  peerGroupings: any[] = [];

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SelectPeerGroupingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private selectedPeerGroupSettingsTag: string,
    private peerGroupingAuthoringService: PeerGroupingAuthoringService
  ) {}

  ngOnInit(): void {
    this.peerGroupingAuthoringService.getPeerGroupSettings().forEach((peerGroupSettings) => {
      this.peerGroupings.push({
        peerGroupSettings: peerGroupSettings,
        stepsUsedIn: this.peerGroupingAuthoringService.getStepsUsedIn(peerGroupSettings.tag)
      });
    });
  }

  addPeerGroupSettings(peerGroupSettingsToAdd: PeerGroupSettings): void {
    this.peerGroupings.push({
      peerGroupSettings: peerGroupSettingsToAdd,
      stepsUsedIn: this.peerGroupingAuthoringService.getStepsUsedIn(peerGroupSettingsToAdd.tag)
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
      .open(CreateNewPeerGroupingDialogComponent, {
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
    this.peerGroupingAuthoringService.deletePeerGroupSettings(tag);
  }
}
