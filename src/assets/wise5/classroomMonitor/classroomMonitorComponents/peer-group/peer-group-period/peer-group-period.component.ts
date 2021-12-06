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
      (groupings: any) => {
        // TODO
      },
      () => {
        // TODO: Handle error
      }
    );
    this.workgroups = this.getWorkgroupsInPeriod();
    this.setDummyGroupingsAndUnassignedWorkgroups();
  }

  getWorkgroupsInPeriod(): any[] {
    return this.ConfigService.getWorkgroupsByPeriod(this.period.periodId).filter(
      (workgroup) => workgroup.workgroupId != null
    );
  }

  setDummyGroupingsAndUnassignedWorkgroups(): void {
    this.groupings = [];
    this.unassignedWorkgroups = [];
    const numUnassignedWorkgroups = this.getDummyNumUnassignedWorkgroups(this.workgroups);
    let tempWorkgroups = [];
    for (let w = 0; w < this.workgroups.length - numUnassignedWorkgroups; w++) {
      tempWorkgroups.push(this.workgroups[w]);
      if (tempWorkgroups.length >= 2) {
        this.addGrouping(this.createGrouping(this.nextAvailableGroupId++, tempWorkgroups));
        tempWorkgroups = [];
      }
    }
    for (
      let w = this.workgroups.length - numUnassignedWorkgroups;
      w < this.workgroups.length;
      w++
    ) {
      this.unassignedWorkgroups.push(this.workgroups[w]);
    }
  }

  getDummyNumUnassignedWorkgroups(workgroups: any[]): number {
    if (workgroups.length >= 4) {
      return 2;
    } else if (workgroups.length === 3) {
      return 1;
    } else {
      return 0;
    }
  }

  createGrouping(id: number = this.nextAvailableGroupId, workgroups: any[]): any {
    return {
      id: id,
      workgroups: workgroups
    };
  }

  addGrouping(grouping: any): void {
    this.groupings.push(grouping);
  }

  createNewGroup(): Subscription {
    return this.PeerGroupService.createNewGroup(this.nodeId, this.componentId).subscribe(
      (group) => {
        this.addGrouping(this.createGrouping(group.id, []));
      },
      () => {
        this.addGrouping(this.createGrouping(this.nextAvailableGroupId++, []));
      }
    );
  }

  moveWorkgroup(event: any): void {
    const workgroupId = event.item.data;
    const previousLocation = event.previousContainer.data.id;
    const newLocation = event.container.data.id;
    this.removeWorkgroup(workgroupId, previousLocation);
    this.addWorkgroupToGroup(workgroupId, newLocation);
    this.PeerGroupService.moveWorkgroupToGroup(
      workgroupId,
      newLocation,
      this.nodeId,
      this.componentId
    ).subscribe(
      () => {
        // TODO
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
      if (this.unassignedWorkgroups[w].workgroupId === workgroupId) {
        this.unassignedWorkgroups.splice(w, 1);
        return;
      }
    }
  }

  removeWorkgroupFromGroup(workgroupId: number, location: number): void {
    for (const group of this.groupings) {
      if (group.id === location) {
        for (let w = 0; w < group.workgroups.length; w++) {
          if (group.workgroups[w].workgroupId === workgroupId) {
            group.workgroups.splice(w, 1);
            return;
          }
        }
      }
    }
  }

  addWorkgroupToGroup(workgroupId: number, location: number): void {
    if (location === 0) {
      this.unassignedWorkgroups.push(this.getWorkgroup(workgroupId));
    } else {
      const group = this.getGroup(location);
      group.workgroups.push(this.getWorkgroup(workgroupId));
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

  getWorkgroup(workgroupId: number): any {
    for (const workgroup of this.workgroups) {
      if (workgroup.workgroupId === workgroupId) {
        return workgroup;
      }
    }
    return null;
  }
}
