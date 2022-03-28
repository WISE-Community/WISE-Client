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
  groupingLogicName: string;

  @Input()
  peerGroupActivityTag: string;

  @Output()
  peerGroupActivityTagChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private dialog: MatDialog,
    private peerGroupSettingsAuthoringService: PeerGroupSettingsAuthoringService
  ) {}

  ngOnInit(): void {
    if (this.peerGroupActivityTag != null && this.peerGroupActivityTag !== '') {
      this.setGroupingLogicName(this.peerGroupActivityTag);
    }
  }

  setGroupingLogicName(peerGroupActivityTag: string): void {
    this.groupingLogicName = this.peerGroupSettingsAuthoringService.getPeerGroupSettingsName(
      peerGroupActivityTag
    );
  }

  selectGroupingLogic(): void {
    const dialogRef = this.dialog.open(SelectPeerGroupSettingsDialogComponent, {
      data: this.peerGroupActivityTag,
      width: '50%'
    });
    dialogRef.afterClosed().subscribe((tag: string) => {
      if (tag != null) {
        this.setGroupingLogicName(tag);
        this.peerGroupActivityTagChanged.emit(tag);
      }
    });
  }
}
