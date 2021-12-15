import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../../services/configService';
import { PeerGroupService } from '../../../../services/peerGroupService';

@Component({
  selector: 'peer-group-period',
  templateUrl: './peer-group-period.component.html',
  styleUrls: ['./peer-group-period.component.scss']
})
export class PeerGroupPeriodComponent implements OnInit {
  @Input() componentId: string;
  @Input() nodeId: string;
  @Input() period: any;

  UNASSIGNED_GROUP_ID = 0;

  groupings: any[] = [];
  nextAvailableGroupId: number = 1;
  unassignedWorkgroups: any[] = [];
  workgroups: any[] = [];

  constructor(private ConfigService: ConfigService, private PeerGroupService: PeerGroupService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.PeerGroupService.retrieveGroupings(this.nodeId, this.componentId).subscribe(
      ({ peerGroups, workgroupsNotInPeerGroup }) => {
        for (const peerGroup of this.getPeerGroupsInPeriod(peerGroups, this.period.periodId)) {
          this.addGrouping(peerGroup);
        }
        this.unassignedWorkgroups = this.getWorkgroupsNotInPeerGroupInPeriod(
          workgroupsNotInPeerGroup,
          this.period.periodId
        );
      },
      () => {
        // TODO
      }
    );
    this.workgroups = this.getWorkgroupsInPeriod();
  }

  getPeerGroupsInPeriod(peerGroups: any[], periodId: number): any[] {
    return peerGroups.filter((peerGroup) => peerGroup.periodId === periodId);
  }

  getWorkgroupsNotInPeerGroupInPeriod(workgroups: any[], periodId: number): any[] {
    return workgroups.filter((workgroup) => workgroup.periodId === periodId);
  }

  getWorkgroupsInPeriod(): any[] {
    const workgroups = [];
    for (const workgroup of this.ConfigService.getWorkgroupsByPeriod(this.period.periodId)) {
      workgroups.push({ id: workgroup.workgroupId });
    }
    return workgroups;
  }

  createGrouping(id: number = this.nextAvailableGroupId, members: any[]): any {
    return {
      id: id,
      members: members
    };
  }

  addGrouping(grouping: any): void {
    this.groupings.push(grouping);
  }

  createNewGroup(): Subscription {
    return this.PeerGroupService.createNewGroup(
      this.period.periodId,
      this.nodeId,
      this.componentId
    ).subscribe(
      (group) => {
        this.addGrouping(group);
      },
      () => {
        // TODO
      }
    );
  }

  moveWorkgroup(event: any): Subscription {
    const workgroupId = event.item.data;
    const previousGroupId = event.previousContainer.data.id;
    const newGroupId = event.container.data.id;
    if (this.isUnassignedGroupId(newGroupId)) {
      return this.removeWorkgroupFromGroupRequest(workgroupId, previousGroupId, newGroupId);
    } else {
      return this.moveWorkgroupToGroupRequest(workgroupId, previousGroupId, newGroupId);
    }
  }

  isUnassignedGroupId(groupId: number): boolean {
    return groupId === this.UNASSIGNED_GROUP_ID;
  }

  removeWorkgroupFromGroupRequest(
    workgroupId: number,
    previousGroupId: number,
    newGroupId: number
  ): Subscription {
    return this.PeerGroupService.removeWorkgroupFromGroup(workgroupId, previousGroupId).subscribe(
      () => {
        this.moveWorkgroupSuccess(workgroupId, previousGroupId, newGroupId);
      },
      () => {
        // TODO
      }
    );
  }

  moveWorkgroupToGroupRequest(
    workgroupId: number,
    previousGroupId: number,
    newGroupId: number
  ): Subscription {
    return this.PeerGroupService.moveWorkgroupToGroup(workgroupId, newGroupId).subscribe(
      () => {
        this.moveWorkgroupSuccess(workgroupId, previousGroupId, newGroupId);
      },
      () => {
        // TODO
      }
    );
  }

  moveWorkgroupSuccess(workgroupId: number, previousGroupId: number, newGroupId: number): void {
    this.removeWorkgroup(workgroupId, previousGroupId);
    this.addWorkgroupToGroup(workgroupId, newGroupId);
  }

  removeWorkgroup(workgroupId: number, groupId: number): void {
    if (this.isUnassignedGroupId(groupId)) {
      this.removeWorkgroupFromUnassigned(workgroupId);
    } else {
      this.removeWorkgroupFromGroup(workgroupId, groupId);
    }
  }

  removeWorkgroupFromUnassigned(workgroupId: any): void {
    for (let w = 0; w < this.unassignedWorkgroups.length; w++) {
      if (this.unassignedWorkgroups[w].id === workgroupId) {
        this.unassignedWorkgroups.splice(w, 1);
        return;
      }
    }
  }

  removeWorkgroupFromGroup(workgroupId: number, groupId: number): void {
    for (const group of this.groupings) {
      if (group.id === groupId) {
        for (let w = 0; w < group.members.length; w++) {
          if (group.members[w].id === workgroupId) {
            group.members.splice(w, 1);
            return;
          }
        }
      }
    }
  }

  addWorkgroupToGroup(workgroupId: number, groupId: number): void {
    const member = { id: workgroupId, periodId: this.period.periodId };
    if (this.isUnassignedGroupId(groupId)) {
      this.unassignedWorkgroups.push(member);
    } else {
      const group = this.getGroup(groupId);
      group.members.push(member);
    }
  }

  getGroup(groupId: number): any {
    for (const group of this.groupings) {
      if (group.id === groupId) {
        return group;
      }
    }
    return null;
  }
}
