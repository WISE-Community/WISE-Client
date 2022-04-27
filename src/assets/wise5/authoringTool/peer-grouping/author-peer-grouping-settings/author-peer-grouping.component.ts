import { Directive, OnInit } from '@angular/core';
import { PeerGroupingSettings } from '../peerGroupingSettings';

@Directive()
export abstract class AuthorPeerGroupingComponent implements OnInit {
  availableLogic: any[] = [
    { name: 'Random', value: 'random' },
    { name: 'Manual', value: 'manual' }
  ];
  settings: PeerGroupingSettings;

  constructor() {}

  ngOnInit(): void {}
}
