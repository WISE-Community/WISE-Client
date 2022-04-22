import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { SelectPeerGroupingDialogComponent } from '../select-peer-grouping-dialog/select-peer-grouping-dialog.component';

@Component({
  selector: 'select-peer-grouping-authoring',
  templateUrl: './select-peer-grouping-authoring.component.html',
  styleUrls: ['./select-peer-grouping-authoring.component.scss']
})
export class SelectPeerGroupingAuthoringComponent implements OnInit {
  peerGroupSettingsName: string;

  @Input()
  peerGroupSettingsTag: string;

  @Output()
  peerGroupActivityTagChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private dialog: MatDialog,
    private peerGroupingAuthoringService: PeerGroupingAuthoringService
  ) {}

  ngOnInit(): void {
    if (this.peerGroupSettingsTag != null && this.peerGroupSettingsTag !== '') {
      this.setPeerGroupSettingsName(this.peerGroupSettingsTag);
    }
  }

  setPeerGroupSettingsName(peerGroupSettingsTag: string): void {
    this.peerGroupSettingsName = this.peerGroupingAuthoringService.getPeerGroupSettingsName(
      peerGroupSettingsTag
    );
  }

  selectGroupingLogic(): void {
    const dialogRef = this.dialog.open(SelectPeerGroupingDialogComponent, {
      data: this.peerGroupSettingsTag,
      width: '50%'
    });
    dialogRef.afterClosed().subscribe((tag: string) => {
      if (tag != null) {
        this.setPeerGroupSettingsName(tag);
        this.peerGroupActivityTagChanged.emit(tag);
      }
    });
  }
}
