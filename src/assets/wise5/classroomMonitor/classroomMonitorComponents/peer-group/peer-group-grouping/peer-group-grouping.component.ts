import { Component, Input } from '@angular/core';
import { PeerGroupWorkgroupsContainerComponent } from '../peer-group-workgroups-container/peer-group-workgroups-container.component';
import { getAvatarColorForWorkgroupId } from '../../../../common/workgroup/workgroup';
import { MatIcon } from '@angular/material/icon';
import { NgStyle } from '@angular/common';
import { MatCardContent } from '@angular/material/card';
import { CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { PeerGroupWorkgroupComponent } from '../peer-group-workgroup/peer-group-workgroup.component';

@Component({
  imports: [MatIcon, NgStyle, MatCardContent, CdkDropList, CdkDrag, PeerGroupWorkgroupComponent],
  selector: 'peer-group-grouping',
  styleUrl: '../peer-group-workgroups-container/peer-group-workgroups-container.component.scss',
  templateUrl: './peer-group-grouping.component.html'
})
export class PeerGroupGroupingComponent extends PeerGroupWorkgroupsContainerComponent {
  protected avatarColor: string;
  @Input() grouping: any;

  ngOnInit(): void {
    this.avatarColor = getAvatarColorForWorkgroupId(this.grouping.id);
  }
}
