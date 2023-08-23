'use strict';

import { Directive, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { TeacherDataService } from '../../../assets/wise5/services/teacherDataService';

@Directive({ selector: 'workgroup-select' })
export class WorkgroupSelectComponent {
  @Input() customClass: string;
  canViewStudentNames: boolean;
  periodId: number;
  selectedItem: any;
  subscriptions: Subscription = new Subscription();
  workgroups: any;

  constructor(protected configService: ConfigService, protected dataService: TeacherDataService) {}

  ngOnInit() {
    this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
    this.periodId = this.dataService.getCurrentPeriod().periodId;
    this.setWorkgroups();
    this.subscriptions.add(
      this.dataService.currentWorkgroupChanged$.subscribe(({ currentWorkgroup }) => {
        if (currentWorkgroup != null) {
          this.setWorkgroups();
          this.setWorkgroup(currentWorkgroup);
        }
      })
    );
    this.subscriptions.add(
      this.dataService.currentPeriodChanged$.subscribe(({ currentPeriod }) => {
        this.periodId = currentPeriod.periodId;
        this.setWorkgroups();
        this.currentPeriodChanged();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setWorkgroups() {}

  protected setWorkgroup(workgroup: any): void {}

  currentPeriodChanged() {}

  sortByField(arr: any[], field: string): any[] {
    return arr.sort((workgroup1, workgroup2) => {
      return workgroup1[field] - workgroup2[field];
    });
  }

  sortByDisplayNames(arr: any[]): any[] {
    return arr.sort((workgroup1, workgroup2) => {
      return workgroup1.displayNames.localeCompare(workgroup2.displayNames);
    });
  }

  filterWorkgroupsBySelectedPeriod() {
    this.workgroups = this.configService.getClassmateUserInfos().filter((workgroup) => {
      return (
        (this.periodId === -1 || workgroup.periodId === this.periodId) &&
        workgroup.workgroupId != null
      );
    });
  }

  setCurrentWorkgroup(workgroup) {
    this.dataService.setCurrentWorkgroup(workgroup);
  }
}
