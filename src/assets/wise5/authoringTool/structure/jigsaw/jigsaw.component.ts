import { Component } from '@angular/core';
import { ConfigureStructureComponent } from '../configure-structure.component';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { FlexModule } from '@angular/flex-layout/flex';
import { FormsModule } from '@angular/forms';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatDivider } from '@angular/material/divider';

@Component({
  imports: [
    MatDivider,
    MatRadioGroup,
    FormsModule,
    MatRadioButton,
    FlexModule,
    MatButton,
    RouterLink,
    NgIf,
    MatProgressBar
  ],
  standalone: true,
  styleUrls: ['./jigsaw.component.scss', '../../add-content.scss'],
  templateUrl: './jigsaw.component.html'
})
export class JigsawComponent extends ConfigureStructureComponent {
  protected numGroups: string = '2';

  protected fetchGroups(numGroups: string): void {
    super.fetchGroups(`jigsaw/groups-${numGroups}.json`);
  }

  protected fetchNodes(numGroups: string): void {
    super.fetchNodes(`jigsaw/nodes-${numGroups}.json`);
  }

  protected injectGroupAndNodes(numGroups: string = '2'): void {
    this.fetchGroups(numGroups);
    this.fetchNodes(numGroups);
  }
}
