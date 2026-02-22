import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { PeerGroupGroupingComponent } from '../peer-group-grouping/peer-group-grouping.component';

@Component({
  imports: [MatCard, PeerGroupGroupingComponent],
  selector: 'peer-group-assigned-workgroups',
  styleUrls: [
    '../peer-group-workgroups-container/peer-group-workgroups-container.component.scss',
    './peer-group-assigned-workgroups.component.scss'
  ],
  templateUrl: './peer-group-assigned-workgroups.component.html'
})
export class PeerGroupAssignedWorkgroupsComponent {
  @Input() groupings: any[];
  @Output() moveWorkgroup: EventEmitter<any> = new EventEmitter<any>();

  emitMoveWorkgroup(event: any): void {
    this.moveWorkgroup.emit(event);
  }
}
