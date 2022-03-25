import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditPeerGroupingDialogComponent } from '../edit-peer-grouping-dialog/edit-peer-grouping-dialog.component';

@Component({
  selector: 'select-peer-grouping',
  templateUrl: './select-peer-grouping.component.html',
  styleUrls: ['./select-peer-grouping.component.scss']
})
export class SelectPeerGroupingComponent implements OnInit {
  @Input()
  peerGrouping: any;

  @Input()
  selectedPeerGroupingTag: string;

  @Output()
  deletePeerGroupingEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  selectPeerGroupingEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  select(): void {
    this.selectPeerGroupingEvent.emit(this.peerGrouping.peerGroupSettings.tag);
  }

  edit(): void {
    this.dialog
      .open(EditPeerGroupingDialogComponent, {
        data: this.peerGrouping,
        width: '40%'
      })
      .afterClosed()
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deletePeerGroupingEvent.emit(this.peerGrouping.peerGroupSettings.tag);
        }
      });
  }

  delete(): void {
    if (confirm($localize`Are you sure you want to delete this Peer Grouping?`)) {
      this.deletePeerGroupingEvent.emit(this.peerGrouping.peerGroupSettings.tag);
    }
  }
}
