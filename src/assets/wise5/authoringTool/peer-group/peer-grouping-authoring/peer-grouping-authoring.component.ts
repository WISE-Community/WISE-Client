import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PeerGroupAuthoringService } from '../../../services/peerGroupAuthoringService';

@Component({
  selector: 'peer-grouping-authoring',
  templateUrl: './peer-grouping-authoring.component.html',
  styleUrls: ['./peer-grouping-authoring.component.scss']
})
export class PeerGroupingAuthoringComponent implements OnInit {
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

  constructor(private peerGroupAuthoringService: PeerGroupAuthoringService) {}

  ngOnInit(): void {}

  save(): void {
    this.peerGroupAuthoringService.updatePeerGroupSettings(this.peerGrouping.peerGroupSetting);
    this.updateEvent.emit();
  }

  cancel(): void {
    this.cancelEvent.emit();
  }
}
