import { Component } from '@angular/core';
import { PeerGroupAuthoringService } from '../../../services/peerGroupAuthoringService';
import { UtilService } from '../../../services/utilService';
import { AuthorPeerGroupingComponent } from '../author-peer-grouping/author-peer-grouping.component';
import { PeerGroupSettings } from '../peerGroupSettings';

@Component({
  selector: 'edit-peer-grouping',
  templateUrl: './edit-peer-grouping.component.html',
  styleUrls: ['./edit-peer-grouping.component.scss']
})
export class EditPeerGroupingComponent extends AuthorPeerGroupingComponent {
  peerGroupSettings: PeerGroupSettings;

  constructor(
    protected peerGroupAuthoringService: PeerGroupAuthoringService,
    private utilService: UtilService
  ) {
    super(peerGroupAuthoringService);
  }

  ngOnInit(): void {
    this.peerGroupSettings = this.utilService.makeCopyOfJSONObject(
      this.peerGrouping.peerGroupSettings
    );
  }

  save(): void {
    this.peerGrouping.peerGroupSettings = this.peerGroupSettings;
    this.peerGroupAuthoringService.updatePeerGroupSettings(this.peerGroupSettings).subscribe(() => {
      this.updateEvent.emit();
    });
  }
}
