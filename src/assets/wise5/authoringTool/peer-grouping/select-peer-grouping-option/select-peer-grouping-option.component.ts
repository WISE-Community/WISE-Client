import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { EditPeerGroupingDialogComponent } from '../edit-peer-grouping-dialog/edit-peer-grouping-dialog.component';
import { availableLogic } from '../PeerGroupingLogic';

@Component({
  selector: 'select-peer-grouping-option',
  templateUrl: './select-peer-grouping-option.component.html',
  styleUrls: ['./select-peer-grouping-option.component.scss']
})
export class SelectPeerGroupingOptionComponent implements OnInit {
  @Input() peerGrouping: PeerGrouping;
  @Input() selectedPeerGrouping: PeerGrouping;
  peerGroupingLogicName: string;
  stepsUsedIn: string[] = [];

  @Output() deleteEvent: EventEmitter<PeerGrouping> = new EventEmitter<PeerGrouping>();
  @Output() selectEvent: EventEmitter<PeerGrouping> = new EventEmitter<PeerGrouping>();

  constructor(
    private dialog: MatDialog,
    private peerGroupingAuthoringService: PeerGroupingAuthoringService
  ) {}

  ngOnInit(): void {
    this.setPeerGroupingLogicName();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedPeerGrouping) {
      this.stepsUsedIn = this.peerGroupingAuthoringService.getStepsUsedIn(this.peerGrouping.tag);
    }
  }

  setPeerGroupingLogicName(): void {
    this.peerGroupingLogicName = availableLogic.find(
      (logic) => logic.value === this.peerGrouping.logic
    ).name;
  }

  select(): void {
    this.selectEvent.emit(this.peerGrouping);
  }

  edit(): void {
    this.dialog
      .open(EditPeerGroupingDialogComponent, {
        data: this.peerGrouping,
        panelClass: 'dialog-sm'
      })
      .afterClosed()
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deleteEvent.emit(this.peerGrouping);
        } else {
          this.setPeerGroupingLogicName();
        }
      });
  }
}
