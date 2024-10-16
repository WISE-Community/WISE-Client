import { Component } from '@angular/core';
import { ConfigureStructureComponent } from '../configure-structure.component';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatDivider } from '@angular/material/divider';

@Component({
  imports: [MatDivider, FlexModule, MatButton, RouterLink, NgIf, MatProgressBar],
  standalone: true,
  styleUrls: ['./peer-review-and-revision.component.scss', '../../add-content.scss'],
  templateUrl: './peer-review-and-revision.component.html'
})
export class PeerReviewAndRevisionComponent extends ConfigureStructureComponent {
  protected groupsPath = `peer-review-and-revision/groups.json`;
  protected nodesPath = `peer-review-and-revision/nodes.json`;
}
