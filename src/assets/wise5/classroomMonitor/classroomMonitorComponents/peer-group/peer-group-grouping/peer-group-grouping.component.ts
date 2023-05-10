import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PeerGroupWorkgroupsContainerComponent } from '../peer-group-workgroups-container/peer-group-workgroups-container.component';
import { getAvatarColorForWorkgroupId } from '../../../../common/workgroup/workgroup';

@Component({
  selector: 'peer-group-grouping',
  templateUrl: './peer-group-grouping.component.html',
  styleUrls: ['../peer-group-workgroups-container/peer-group-workgroups-container.component.scss']
})
export class PeerGroupGroupingComponent extends PeerGroupWorkgroupsContainerComponent {
  @Input() grouping: any;

  avatarColor: string;

  constructor(protected dialog: MatDialog) {
    super(dialog);
  }

  ngOnInit(): void {
    this.avatarColor = getAvatarColorForWorkgroupId(this.grouping.id);
  }
}
