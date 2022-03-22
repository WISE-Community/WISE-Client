import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'peer-grouping-selecting',
  templateUrl: './peer-grouping-selecting.component.html',
  styleUrls: ['./peer-grouping-selecting.component.scss']
})
export class PeerGroupingSelectingComponent implements OnInit {
  @Input()
  peerGrouping: any;

  @Input()
  selectedPeerGroupingTag: string;

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
}
