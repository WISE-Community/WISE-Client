import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditPeerGroupSettingsDialogComponent } from '../edit-peer-group-settings-dialog/edit-peer-group-settings-dialog.component';

@Component({
  selector: 'select-peer-group-settings-option',
  templateUrl: './select-peer-group-settings-option.component.html',
  styleUrls: ['./select-peer-group-settings-option.component.scss']
})
export class SelectPeerGroupSettingsOptionComponent implements OnInit {
  @Input()
  peerGrouping: any;

  @Input()
  selectedPeerGroupSettingsTag: string;

  @Output()
  deletePeerGroupSettingsEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  selectPeerGroupSettingsEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  select(): void {
    this.selectPeerGroupSettingsEvent.emit(this.peerGrouping.peerGroupSettings.tag);
  }

  edit(): void {
    this.dialog
      .open(EditPeerGroupSettingsDialogComponent, {
        data: this.peerGrouping,
        width: '40%'
      })
      .afterClosed()
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deletePeerGroupSettingsEvent.emit(this.peerGrouping.peerGroupSettings.tag);
        }
      });
  }

  delete(): void {
    if (confirm($localize`Are you sure you want to delete this Peer Grouping?`)) {
      this.deletePeerGroupSettingsEvent.emit(this.peerGrouping.peerGroupSettings.tag);
    }
  }
}
