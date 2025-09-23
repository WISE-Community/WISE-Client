import { Component, Input } from '@angular/core';
import { PeerGroupWorkgroupsContainerComponent } from '../peer-group-workgroups-container/peer-group-workgroups-container.component';
import { getAvatarColorForWorkgroupId } from '../../../../common/workgroup/workgroup';

@Component({
  selector: 'peer-group-grouping',
  templateUrl: './peer-group-grouping.component.html',
  styleUrl: '../peer-group-workgroups-container/peer-group-workgroups-container.component.scss',
  standalone: false
})
export class PeerGroupGroupingComponent extends PeerGroupWorkgroupsContainerComponent {
  protected avatarColor: string;
  @Input() grouping: any;

  ngOnInit(): void {
    this.avatarColor = getAvatarColorForWorkgroupId(this.grouping.id);
  }
}
