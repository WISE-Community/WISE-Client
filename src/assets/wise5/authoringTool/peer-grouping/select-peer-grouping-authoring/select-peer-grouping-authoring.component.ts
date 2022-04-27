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
  name: string;
  @Input() tag: string;
  @Output() tagChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private dialog: MatDialog,
    private peerGroupingAuthoringService: PeerGroupingAuthoringService
  ) {}

  ngOnInit(): void {
    if (this.tag != null && this.tag !== '') {
      this.setName(this.tag);
    }
  }

  setName(tag: string): void {
    this.name = this.peerGroupingAuthoringService.getPeerGroupingSettingsName(tag);
  }

  selectGroupingLogic(): void {
    this.dialog
      .open(SelectPeerGroupingDialogComponent, {
        data: this.tag,
        width: '50%'
      })
      .afterClosed()
      .subscribe((tag: string) => {
        if (tag != null) {
          this.setName(tag);
          this.tagChanged.emit(tag);
        }
      });
  }
}
