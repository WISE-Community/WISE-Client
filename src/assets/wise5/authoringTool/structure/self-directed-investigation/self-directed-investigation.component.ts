import { Component } from '@angular/core';
import { ConfigureStructureComponent } from '../configure-structure.component';

@Component({
  selector: 'self-directed-investigation',
  templateUrl: './self-directed-investigation.component.html',
  styleUrls: ['./self-directed-investigation.component.scss', '../../add-content.scss']
})
export class SelfDirectedInvestigationComponent extends ConfigureStructureComponent {
  protected groupsPath = `self-directed-investigation/groups.json`;
  protected nodesPath = `self-directed-investigation/nodes.json`;
}
