import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PeerGroupSettingsAuthoringService } from '../../../services/peerGroupSettingsAuthoringService';
import { SelectPeerGroupSettingsDialogComponent } from '../select-peer-group-settings-dialog/select-peer-group-settings-dialog.component';

@Component({
  selector: 'select-peer-group-settings-authoring',
  templateUrl: './select-peer-group-settings-authoring.component.html',
  styleUrls: ['./select-peer-group-settings-authoring.component.scss']
})
export class SelectPeerGroupSettingsAuthoringComponent implements OnInit {
  peerGroupSettingsName: string;

  @Input()
  peerGroupSettingsTag: string;

  @Output()
  peerGroupActivityTagChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private dialog: MatDialog,
    private peerGroupSettingsAuthoringService: PeerGroupSettingsAuthoringService
  ) {}

  ngOnInit(): void {
    if (this.peerGroupSettingsTag != null && this.peerGroupSettingsTag !== '') {
      this.setPeerGroupSettingsName(this.peerGroupSettingsTag);
    }
  }

  setPeerGroupSettingsName(peerGroupSettingsTag: string): void {
    this.peerGroupSettingsName = this.peerGroupSettingsAuthoringService.getPeerGroupSettingsName(
      peerGroupSettingsTag
    );
  }

  selectGroupingLogic(): void {
    const dialogRef = this.dialog.open(SelectPeerGroupSettingsDialogComponent, {
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
