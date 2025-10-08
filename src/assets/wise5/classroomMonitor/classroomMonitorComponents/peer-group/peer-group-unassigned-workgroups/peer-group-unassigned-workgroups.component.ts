import { Component, Input } from '@angular/core';
import { PeerGroupWorkgroupsContainerComponent } from '../peer-group-workgroups-container/peer-group-workgroups-container.component';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { PeerGroupWorkgroupComponent } from '../peer-group-workgroup/peer-group-workgroup.component';

@Component({
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    CdkDropList,
    CdkDrag,
    PeerGroupWorkgroupComponent
  ],
  selector: 'peer-group-unassigned-workgroups',
  styleUrl: '../peer-group-workgroups-container/peer-group-workgroups-container.component.scss',
  templateUrl: './peer-group-unassigned-workgroups.component.html'
})
export class PeerGroupUnassignedWorkgroupsComponent extends PeerGroupWorkgroupsContainerComponent {
  @Input() unassignedWorkgroups: any[];
}
