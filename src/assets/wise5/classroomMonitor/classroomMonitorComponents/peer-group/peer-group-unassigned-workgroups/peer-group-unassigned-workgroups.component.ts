import { Component, Input } from '@angular/core';
import { PeerGroupWorkgroupsContainerComponent } from '../peer-group-workgroups-container/peer-group-workgroups-container.component';

@Component({
  selector: 'peer-group-unassigned-workgroups',
  templateUrl: './peer-group-unassigned-workgroups.component.html',
  styleUrls: ['../peer-group-workgroups-container/peer-group-workgroups-container.component.scss']
})
export class PeerGroupUnassignedWorkgroupsComponent extends PeerGroupWorkgroupsContainerComponent {
  @Input()
  unassignedWorkgroups: any[];
}
