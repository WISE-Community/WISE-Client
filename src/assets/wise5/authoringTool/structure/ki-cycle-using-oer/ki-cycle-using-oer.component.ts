import { Component } from '@angular/core';
import { ConfigureStructureComponent } from '../configure-structure.component';

@Component({
  selector: 'ki-cycle-using-oer',
  templateUrl: './ki-cycle-using-oer.component.html',
  styleUrls: ['./ki-cycle-using-oer.component.scss', '../../add-content.scss']
})
export class KiCycleUsingOerComponent extends ConfigureStructureComponent {
  protected groupsPath = `ki-cycle-using-oer/groups.json`;
  protected nodesPath = `ki-cycle-using-oer/nodes.json`;
}
