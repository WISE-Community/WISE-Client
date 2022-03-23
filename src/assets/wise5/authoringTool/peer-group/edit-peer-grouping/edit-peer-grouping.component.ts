import { Component } from '@angular/core';
import { PeerGroupAuthoringService } from '../../../services/peerGroupAuthoringService';
import { AuthorPeerGroupingComponent } from '../author-peer-grouping/author-peer-grouping.component';

@Component({
  selector: 'edit-peer-grouping',
  templateUrl: './edit-peer-grouping.component.html',
  styleUrls: ['./edit-peer-grouping.component.scss']
})
export class EditPeerGroupingComponent extends AuthorPeerGroupingComponent {
  constructor(protected peerGroupAuthoringService: PeerGroupAuthoringService) {
    super(peerGroupAuthoringService);
  }

  ngOnInit(): void {}
}
