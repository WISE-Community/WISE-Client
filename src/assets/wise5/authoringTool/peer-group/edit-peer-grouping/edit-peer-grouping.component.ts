import { Component } from '@angular/core';
import { PeerGroupAuthoringService } from '../../../services/peerGroupAuthoringService';
import { PeerGroupingAuthoringComponent } from '../peer-grouping-authoring/peer-grouping-authoring.component';

@Component({
  selector: 'edit-peer-grouping',
  templateUrl: './edit-peer-grouping.component.html',
  styleUrls: ['./edit-peer-grouping.component.scss']
})
export class EditPeerGroupingComponent extends PeerGroupingAuthoringComponent {
  constructor(protected peerGroupAuthoringService: PeerGroupAuthoringService) {
    super(peerGroupAuthoringService);
  }

  ngOnInit(): void {}
}
