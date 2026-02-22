import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { SelectPeerGroupingDialogComponent } from '../select-peer-grouping-dialog/select-peer-grouping-dialog.component';
import { MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'select-peer-grouping-authoring',
  templateUrl: './select-peer-grouping-authoring.component.html',
  styles: ['.bottom-spacing { margin-bottom: 10px; }'],
  imports: [MatLabel, MatButton, MatTooltip]
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
