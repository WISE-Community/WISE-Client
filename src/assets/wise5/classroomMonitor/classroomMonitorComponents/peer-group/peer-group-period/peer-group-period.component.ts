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
    const previousLocation = event.previousContainer.data.id;
    const newLocation = event.container.data.id;
    return this.PeerGroupService.moveWorkgroupToGroup(workgroupId, newLocation).subscribe(
      (workgroup) => {
        this.removeWorkgroup(workgroupId, previousLocation);
        this.addWorkgroupToGroup(workgroupId, newLocation);
      },
      () => {
        // TODO
      }
    );
  }

  removeWorkgroup(workgroupId: number, location: number): void {
    if (location === 0) {
      this.removeWorkgroupFromUnassigned(workgroupId);
    } else {
      this.removeWorkgroupFromGroup(workgroupId, location);
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

  removeWorkgroupFromGroup(workgroupId: number, location: number): void {
    for (const group of this.groupings) {
      if (group.id === location) {
        for (let w = 0; w < group.members.length; w++) {
          if (group.members[w].id === workgroupId) {
            group.members.splice(w, 1);
            return;
          }
        }
      }
    }
  }

  addWorkgroupToGroup(workgroupId: number, location: number): void {
    const member = { id: workgroupId, periodId: this.period.periodId };
    if (location === 0) {
      this.unassignedWorkgroups.push(member);
    } else {
      const group = this.getGroup(location);
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
