import { Component } from '@angular/core';
import { ConfigureStructureComponent } from '../configure-structure.component';

@Component({
  selector: 'self-directed-investigation',
  templateUrl: './self-directed-investigation.component.html',
  styleUrls: ['./self-directed-investigation.component.scss']
})
export class SelfDirectedInvestigationComponent extends ConfigureStructureComponent {
  groupsPath = `self-directed-investigation/groups.json`;
  nodesPath = `self-directed-investigation/nodes.json`;
}
