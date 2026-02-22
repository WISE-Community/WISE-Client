import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { RouterLink } from '@angular/router';
import { ConfigureStructureComponent } from '../configure-structure.component';

@Component({
  imports: [MatDivider, MatRadioModule, FormsModule, MatButton, RouterLink, MatProgressBar],
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
