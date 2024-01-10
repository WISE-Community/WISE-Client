import { Component } from '@angular/core';
import { ConfigureStructureComponent } from '../configure-structure.component';

@Component({
  selector: 'peer-review-and-revision',
  templateUrl: './peer-review-and-revision.component.html',
  styleUrls: ['./peer-review-and-revision.component.scss', '../../add-content.scss']
})
export class PeerReviewAndRevisionComponent extends ConfigureStructureComponent {
  protected groupsPath = `peer-review-and-revision/groups.json`;
  protected nodesPath = `peer-review-and-revision/nodes.json`;
}
