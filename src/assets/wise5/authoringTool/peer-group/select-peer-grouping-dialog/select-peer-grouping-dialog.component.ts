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
    public dialogRef: MatDialogRef<SelectPeerGroupingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private peerGroupAuthoringService: PeerGroupAuthoringService
  ) {
    this.selectedPeerGroupingTag = this.data.peerGroupingTag;
  }

  ngOnInit(): void {
    this.peerGroupAuthoringService.getPeerGroupSettings().forEach((peerGroupSetting) => {
      this.peerGroupings.push({
        peerGroupSetting: peerGroupSetting,
        stepsUsedIn: this.peerGroupAuthoringService.getStepsUsedIn(peerGroupSetting.tag)
      });
    });
  }

  addPeerGroupSettings(peerGroupSettings: PeerGroupSettings): void {
    this.peerGroupings.push({
      peerGroupSetting: peerGroupSettings,
      stepsUsedIn: this.peerGroupAuthoringService.getStepsUsedIn(peerGroupSettings.tag)
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
}
