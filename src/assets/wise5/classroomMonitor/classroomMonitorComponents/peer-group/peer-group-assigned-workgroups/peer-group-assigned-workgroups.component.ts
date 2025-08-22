import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'peer-group-assigned-workgroups',
  templateUrl: './peer-group-assigned-workgroups.component.html',
  styleUrls: [
    '../peer-group-workgroups-container/peer-group-workgroups-container.component.scss',
    './peer-group-assigned-workgroups.component.scss'
  ],
  standalone: false
})
export class PeerGroupAssignedWorkgroupsComponent {
  @Input() groupings: any[];
  @Output() moveWorkgroup: EventEmitter<any> = new EventEmitter<any>();

  emitMoveWorkgroup(event: any): void {
    this.moveWorkgroup.emit(event);
  }
}
