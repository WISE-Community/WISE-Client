import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { CreateNewPeerGroupingDialogComponent } from '../create-new-peer-grouping-dialog/create-new-peer-grouping-dialog.component';
import { PeerGroupingSettings } from '../peerGroupingSettings';

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
    @Inject(MAT_DIALOG_DATA) private selectedTag: string,
    private peerGroupingAuthoringService: PeerGroupingAuthoringService
  ) {}

  ngOnInit(): void {
    this.peerGroupingAuthoringService.getPeerGroupingSettings().forEach((peerGroupingSettings) => {
      this.peerGroupings.push({
        settings: peerGroupingSettings,
        stepsUsedIn: this.peerGroupingAuthoringService.getStepsUsedIn(peerGroupingSettings.tag)
      });
    });
  }

  addPeerGrouping(peerGroupingSettingsToAdd: PeerGroupingSettings): void {
    this.peerGroupings.push({
      settings: peerGroupingSettingsToAdd,
      stepsUsedIn: this.peerGroupingAuthoringService.getStepsUsedIn(peerGroupingSettingsToAdd.tag)
    });
  }

  selectPeerGrouping(tag: string): void {
    this.selectedTag = tag;
  }

  save(): void {
    this.dialogRef.close(this.selectedTag);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  showNewPeerGroupingAuthoring(): void {
    this.dialog
      .open(CreateNewPeerGroupingDialogComponent, {
        width: '40%'
      })
      .afterClosed()
      .subscribe((peerGroupingSettings: PeerGroupingSettings) => {
        if (peerGroupingSettings != null) {
          this.addPeerGrouping(peerGroupingSettings);
        }
      });
  }

  deletePeerGrouping(tag: string): void {
    for (let p = 0; p < this.peerGroupings.length; p++) {
      const peerGrouping = this.peerGroupings[p];
      if (peerGrouping.settings.tag === tag) {
        this.peerGroupings.splice(p, 1);
        break;
      }
    }
    this.peerGroupingAuthoringService.deletePeerGroupingSettings(tag);
  }
}
