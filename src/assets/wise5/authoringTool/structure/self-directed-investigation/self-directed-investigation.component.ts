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
  styleUrls: ['./self-directed-investigation.component.scss', '../../add-content.scss'],
  templateUrl: './self-directed-investigation.component.html'
})
export class SelfDirectedInvestigationComponent extends ConfigureStructureComponent {
  protected groupsPath = `self-directed-investigation/groups.json`;
  protected nodesPath = `self-directed-investigation/nodes.json`;
}
