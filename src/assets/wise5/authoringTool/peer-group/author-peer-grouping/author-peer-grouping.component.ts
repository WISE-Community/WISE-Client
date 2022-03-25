import { Directive, OnInit } from '@angular/core';
import { PeerGroupSettings } from '../peerGroupSettings';

@Directive()
export abstract class AuthorPeerGroupingComponent implements OnInit {
  availableLogic: any[] = [
    { name: 'Random', value: 'random' },
    { name: 'Manual', value: 'manual' }
  ];
  peerGroupSettings: PeerGroupSettings;

  constructor() {}

  ngOnInit(): void {}
}
