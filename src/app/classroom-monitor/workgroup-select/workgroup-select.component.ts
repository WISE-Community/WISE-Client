'use strict';

import { Directive, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { TeacherDataService } from '../../../assets/wise5/services/teacherDataService';

@Directive({ selector: 'workgroup-select' })
export class WorkgroupSelectComponent {
  @Input()
  customClass: string;
  canViewStudentNames: boolean;
  periodId: number;
  selectedItem: any;
  workgroups: any;
  subscriptions: Subscription = new Subscription();

  constructor(
    protected ConfigService: ConfigService,
    protected TeacherDataService: TeacherDataService
  ) {}

  ngOnInit() {
    this.canViewStudentNames = this.ConfigService.getPermissions().canViewStudentNames;
    this.periodId = this.TeacherDataService.getCurrentPeriod().periodId;
    this.setWorkgroups();
    this.subscriptions.add(
      this.TeacherDataService.currentWorkgroupChanged$.subscribe(({ currentWorkgroup }) => {
        if (currentWorkgroup != null) {
          this.setWorkgroups();
        }
      })
    );
    this.subscriptions.add(
      this.TeacherDataService.currentPeriodChanged$.subscribe(({ currentPeriod }) => {
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
    this.workgroups = this.ConfigService.getClassmateUserInfos().filter((workgroup) => {
      return (
        (this.periodId === -1 || workgroup.periodId === this.periodId) &&
        workgroup.workgroupId != null
      );
    });
  }

  setCurrentWorkgroup(workgroup) {
    this.TeacherDataService.setCurrentWorkgroup(workgroup);
  }
}
