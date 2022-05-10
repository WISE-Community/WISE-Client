import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { SelectPeerGroupingDialogComponent } from '../select-peer-grouping-dialog/select-peer-grouping-dialog.component';

@Component({
  selector: 'select-peer-grouping-authoring',
  templateUrl: './select-peer-grouping-authoring.component.html',
  styleUrls: ['./select-peer-grouping-authoring.component.scss']
})
export class SelectPeerGroupingAuthoringComponent implements OnInit {
  peerGrouping: PeerGrouping;
  @Input() tag: string;
  @Output() tagChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private dialog: MatDialog,
    private peerGroupingAuthoringService: PeerGroupingAuthoringService
  ) {}

  ngOnInit(): void {
    this.peerGrouping = this.peerGroupingAuthoringService.getPeerGrouping(this.tag);
  }

  selectGroupingLogic(): void {
    this.dialog.open(SelectPeerGroupingDialogComponent, {
      data: {
        peerGrouping: this.peerGrouping,
        updateSelectedTag: (tag: string) => {
          this.peerGrouping = this.peerGroupingAuthoringService.getPeerGrouping(tag);
          this.tagChanged.emit(tag);
        }
      },
      panelClass: 'dialog-md'
    });
  }
}
