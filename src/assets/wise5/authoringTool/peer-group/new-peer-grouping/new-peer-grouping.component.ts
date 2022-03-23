import { Component, EventEmitter, Output } from '@angular/core';
import { PeerGroupAuthoringService } from '../../../services/peerGroupAuthoringService';
import { AuthorPeerGroupingComponent } from '../author-peer-grouping/author-peer-grouping.component';
import { PeerGroupSettings } from '../peerGroupSettings';

@Component({
  selector: 'new-peer-grouping',
  templateUrl: './new-peer-grouping.component.html',
  styleUrls: ['./new-peer-grouping.component.scss']
})
export class NewPeerGroupingComponent extends AuthorPeerGroupingComponent {
  @Output()
  createPeerGroupingEvent: EventEmitter<any> = new EventEmitter<any>();

  peerGroupSettings: PeerGroupSettings = new PeerGroupSettings();

  constructor(protected peerGroupAuthoringService: PeerGroupAuthoringService) {
    super(peerGroupAuthoringService);
  }

  ngOnInit(): void {
    this.peerGroupSettings.logic = 'random';
    this.peerGroupSettings.maxMembershipCount = 2;
  }

  create(): void {
    this.peerGroupSettings.tag = this.peerGroupAuthoringService.getUniqueTag();
    this.peerGroupAuthoringService
      .createNewPeerGroupSettings(this.peerGroupSettings)
      .subscribe(() => {
        this.createPeerGroupingEvent.emit(this.peerGroupSettings);
      });
  }
}
