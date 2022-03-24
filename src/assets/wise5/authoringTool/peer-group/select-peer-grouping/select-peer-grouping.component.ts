import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  editSettingsEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  selectPeerGroupingEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  select(): void {
    this.selectPeerGroupingEvent.emit(this.peerGrouping.peerGroupSetting.tag);
  }

  edit(): void {
    this.editSettingsEvent.emit();
  }

  delete(): void {
    if (confirm($localize`Are you sure you want to delete this Peer Grouping?`)) {
      this.deletePeerGroupingEvent.emit(this.peerGrouping.peerGroupSetting.tag);
    }
  }
}
