import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'display-peer-grouping',
  templateUrl: './display-peer-grouping.component.html',
  styleUrls: ['./display-peer-grouping.component.scss']
})
export class DisplayPeerGroupingComponent implements OnInit {
  isAuthoring: boolean = false;

  @Input()
  peerGrouping: any;

  @Input()
  selectedPeerGroupingTag: string;

  @Output()
  deletePeerGroupingEvent: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  selectPeerGroupingEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  selectPeerGrouping($event: any): void {
    this.selectPeerGroupingEvent.emit($event);
  }

  showAuthoringView(): void {
    this.isAuthoring = true;
  }

  hideAuthoringView(): void {
    this.isAuthoring = false;
  }

  deletePeerGrouping($event: any): void {
    this.deletePeerGroupingEvent.emit($event);
  }
}
