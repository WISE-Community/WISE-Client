import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGroupAuthoringService } from '../../../services/peerGroupAuthoringService';
import { PeerGroupSettings } from '../peerGroupSettings';

@Component({
  selector: 'select-peer-grouping-dialog',
  templateUrl: './select-peer-grouping-dialog.component.html',
  styleUrls: ['./select-peer-grouping-dialog.component.scss']
})
export class SelectPeerGroupingDialogComponent implements OnInit {
  isShowNewGroupingAuthoring: boolean = false;
  peerGroupings: any[] = [];
  selectedPeerGroupingTag: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SelectPeerGroupingDialogComponent>,
    private peerGroupAuthoringService: PeerGroupAuthoringService
  ) {
    this.selectedPeerGroupingTag = this.data.peerGroupingTag;
  }

  ngOnInit(): void {
    this.peerGroupAuthoringService.getPeerGroupSettings().forEach((peerGroupSettings) => {
      this.peerGroupings.push({
        peerGroupSettings: peerGroupSettings,
        stepsUsedIn: this.peerGroupAuthoringService.getStepsUsedIn(peerGroupSettings.tag)
      });
    });
  }

  addPeerGroupSettings(peerGroupSettingsToAdd: PeerGroupSettings): void {
    this.peerGroupings.push({
      peerGroupSettings: peerGroupSettingsToAdd,
      stepsUsedIn: this.peerGroupAuthoringService.getStepsUsedIn(peerGroupSettingsToAdd.tag)
    });
  }

  selectPeerGrouping(tag: string): void {
    this.selectedPeerGroupingTag = tag;
  }

  save(): void {
    this.dialogRef.close(this.selectedPeerGroupingTag);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  showNewGroupingAuthoring(): void {
    this.isShowNewGroupingAuthoring = true;
  }

  hideNewGroupingAuthoring(): void {
    this.isShowNewGroupingAuthoring = false;
  }

  createPeerGrouping(peerGroupSettings: PeerGroupSettings): void {
    this.hideNewGroupingAuthoring();
    this.addPeerGroupSettings(peerGroupSettings);
  }

  deletePeerGrouping(tag: string): void {
    for (let p = 0; p < this.peerGroupings.length; p++) {
      const peerGrouping = this.peerGroupings[p];
      if (peerGrouping.peerGroupSettings.tag === tag) {
        this.peerGroupings.splice(p, 1);
        break;
      }
    }
    this.peerGroupAuthoringService.deletePeerGroupSettings(tag);
  }
}
