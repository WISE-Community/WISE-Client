import { Component } from '@angular/core';
import { ConfigureStructureComponent } from '../configure-structure.component';

@Component({
  selector: 'jigsaw',
  templateUrl: './jigsaw.component.html',
  styleUrls: ['./jigsaw.component.scss', '../../add-content.scss']
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
