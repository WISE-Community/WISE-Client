import { Component } from '@angular/core';
import { ConfigureStructureComponent } from '../configure-structure.component';

@Component({
  selector: 'ki-cycle-using-oer',
  templateUrl: './ki-cycle-using-oer.component.html',
  styleUrls: ['./ki-cycle-using-oer.component.scss']
})
export class KiCycleUsingOerComponent extends ConfigureStructureComponent {
  groupsPath = `ki-cycle-using-oer/groups.json`;
  nodesPath = `ki-cycle-using-oer/nodes.json`;
}
