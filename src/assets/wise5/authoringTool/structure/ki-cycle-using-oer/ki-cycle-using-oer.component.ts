import { Component } from '@angular/core';
import { ConfigureStructureComponent } from '../configure-structure.component';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';

@Component({
  imports: [MatDivider, MatButton, RouterLink, MatProgressBar],
  styleUrl: '../../add-content.scss',
  templateUrl: './ki-cycle-using-oer.component.html'
})
export class KiCycleUsingOerComponent extends ConfigureStructureComponent {
  protected groupsPath = `ki-cycle-using-oer/groups.json`;
  protected nodesPath = `ki-cycle-using-oer/nodes.json`;
}
