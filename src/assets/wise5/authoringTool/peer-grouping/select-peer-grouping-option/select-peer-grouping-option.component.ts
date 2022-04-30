import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { EditPeerGroupingDialogComponent } from '../edit-peer-grouping-dialog/edit-peer-grouping-dialog.component';

@Component({
  selector: 'select-peer-grouping-option',
  templateUrl: './select-peer-grouping-option.component.html',
  styleUrls: ['./select-peer-grouping-option.component.scss']
})
export class SelectPeerGroupingOptionComponent implements OnInit {
  @Input() peerGrouping: PeerGrouping;
  @Input() selectedTag: string;
  stepsUsedIn: string[] = [];

  @Output() deleteEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private dialog: MatDialog,
    private peerGroupingAuthoringService: PeerGroupingAuthoringService
  ) {}

  ngOnInit(): void {
    this.stepsUsedIn = this.peerGroupingAuthoringService.getStepsUsedIn(this.peerGrouping.tag);
  }

  select(): void {
    this.selectEvent.emit(this.peerGrouping.tag);
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
          this.deleteEvent.emit(this.peerGrouping.tag);
        }
      });
  }
}
