import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'peer-grouping-display',
  templateUrl: './peer-grouping-display.component.html',
  styleUrls: ['./peer-grouping-display.component.scss']
})
export class PeerGroupingDisplayComponent implements OnInit {
  isAuthoring: boolean = false;

  @Input()
  peerGrouping: any;

  @Input()
  selectedPeerGroupingTag: string;

  @Output()
  selectPeerGroupingEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  selectPeerGrouping($event): void {
    this.selectPeerGroupingEvent.emit($event);
  }

  showAuthoringView(): void {
    this.isAuthoring = true;
  }

  hideAuthoringView(): void {
    this.isAuthoring = false;
  }
}
