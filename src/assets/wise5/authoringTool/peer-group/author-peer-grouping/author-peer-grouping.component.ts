import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PeerGroupAuthoringService } from '../../../services/peerGroupAuthoringService';

@Component({
  selector: 'author-peer-grouping',
  templateUrl: './author-peer-grouping.component.html',
  styleUrls: ['./author-peer-grouping.component.scss']
})
export class AuthorPeerGroupingComponent implements OnInit {
  availableLogic: any[] = [
    { name: 'Random', value: 'random' },
    { name: 'Manual', value: 'manual' }
  ];

  @Input()
  peerGrouping: any;

  @Output()
  cancelEvent: EventEmitter<any> = new EventEmitter();

  @Output()
  updateEvent: EventEmitter<any> = new EventEmitter();

  constructor(protected peerGroupAuthoringService: PeerGroupAuthoringService) {}

  ngOnInit(): void {}

  cancel(): void {
    this.cancelEvent.emit();
  }
}
