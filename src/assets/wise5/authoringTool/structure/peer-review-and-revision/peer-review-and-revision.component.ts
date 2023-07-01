import { Component } from '@angular/core';
import { ConfigureStructureComponent } from '../configure-structure.component';

@Component({
  selector: 'peer-review-and-revision',
  templateUrl: './peer-review-and-revision.component.html',
  styleUrls: ['./peer-review-and-revision.component.scss']
})
export class PeerReviewAndRevisionComponent extends ConfigureStructureComponent {
  ngOnInit(): void {
    this.groupsPath = `peer-review-and-revision/groups.json`;
    this.nodesPath = `peer-review-and-revision/nodes.json`;
    super.ngOnInit();
  }
}
