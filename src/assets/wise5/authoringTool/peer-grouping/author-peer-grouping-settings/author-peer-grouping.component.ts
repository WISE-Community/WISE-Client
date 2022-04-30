import { Directive, OnInit } from '@angular/core';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';

@Directive()
export abstract class AuthorPeerGroupingComponent implements OnInit {
  availableLogic: any[] = [
    { name: 'Random', value: 'random' },
    { name: 'Manual', value: 'manual' }
  ];
  peerGrouping: PeerGrouping;

  constructor() {}

  ngOnInit(): void {}
}
