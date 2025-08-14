import { Component } from '@angular/core';
import { ConfigureStructureComponent } from '../configure-structure.component';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';

@Component({
  imports: [MatDivider, MatButton, RouterLink, MatProgressBar],
  styleUrl: '../../add-content.scss',
  templateUrl: './peer-review-and-revision.component.html'
})
export class PeerReviewAndRevisionComponent extends ConfigureStructureComponent {
  protected groupsPath = `peer-review-and-revision/groups.json`;
  protected nodesPath = `peer-review-and-revision/nodes.json`;
}
