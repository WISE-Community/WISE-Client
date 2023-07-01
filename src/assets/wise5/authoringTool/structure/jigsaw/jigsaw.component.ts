import { Component } from '@angular/core';
import { ConfigureStructureComponent } from '../configure-structure.component';

@Component({
  selector: 'jigsaw',
  templateUrl: './jigsaw.component.html',
  styleUrls: ['./jigsaw.component.scss']
})
export class JigsawComponent extends ConfigureStructureComponent {
  numGroups: string = '2';

  ngOnChanges(): void {
    this.injectGroupAndNodes(this.numGroups);
  }

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

  protected chooseLocation(): void {
    this.$state.go('root.at.project.structure.location', { structure: this.structure });
  }
}
