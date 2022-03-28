import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PeerGroupAuthoringService } from '../../../services/peerGroupAuthoringService';
import { SelectPeerGroupingDialogComponent } from '../select-peer-grouping-dialog/select-peer-grouping-dialog.component';

@Component({
  selector: 'select-peer-grouping-authoring',
  templateUrl: './select-peer-grouping-authoring.component.html',
  styleUrls: ['./select-peer-grouping-authoring.component.scss']
})
export class SelectPeerGroupingAuthoringComponent implements OnInit {
  groupingLogicName: string;

  @Input()
  peerGroupActivityTag: string;

  @Output()
  peerGroupActivityTagChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private dialog: MatDialog,
    private peerGroupAuthoringService: PeerGroupAuthoringService
  ) {}

  ngOnInit(): void {
    if (this.peerGroupActivityTag != null && this.peerGroupActivityTag !== '') {
      this.setGroupingLogicName(this.peerGroupActivityTag);
    }
  }

  setGroupingLogicName(peerGroupActivityTag: string): void {
    this.groupingLogicName = this.peerGroupAuthoringService.getPeerGroupingName(
      peerGroupActivityTag
    );
  }

  selectGroupingLogic(): void {
    const dialogRef = this.dialog.open(SelectPeerGroupingDialogComponent, {
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
