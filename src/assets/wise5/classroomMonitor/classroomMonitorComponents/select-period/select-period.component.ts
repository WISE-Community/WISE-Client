'use strict';

import { Component, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { StudentStatusService } from '../../../services/studentStatusService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  selector: 'select-period',
  styleUrls: ['select-period.component.scss'],
  templateUrl: 'select-period.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SelectPeriodComponent {
  currentPeriod: any;
  periods: any;
  rootNodeId: string;
  selectedPeriodId: number;
  selectedPeriodText: string;
  subscriptions: Subscription = new Subscription();

  constructor(
    private ProjectService: TeacherProjectService,
    private StudentStatusService: StudentStatusService,
    private TeacherDataService: TeacherDataService
  ) {}

  ngOnInit() {
    const startNodeId = this.ProjectService.getStartNodeId();
    this.rootNodeId = this.ProjectService.getRootNode(startNodeId).id;
    this.currentPeriod = this.TeacherDataService.getCurrentPeriod();
    this.selectedPeriodId = this.currentPeriod.periodId;
    this.updateSelectedText();
    this.periods = this.TeacherDataService.getPeriods();
    this.populateNumWorkgroupsInPeriod();
    this.subscriptions.add(
      this.TeacherDataService.currentPeriodChanged$.subscribe(({ currentPeriod }) => {
        this.currentPeriod = currentPeriod;
        this.updateSelectedText();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  populateNumWorkgroupsInPeriod() {
    for (let i = 0; i < this.periods.length; i++) {
      const period = this.periods[i];
      const id = i === 0 ? -1 : period.periodId;
      period.numWorkgroupsInPeriod = this.getNumberOfWorkgroupsInPeriod(id);
    }
  }

  getPeriodByPeriodId(periodId: number) {
    return this.periods.find((period) => {
      return period.periodId === periodId;
    });
  }

  currentPeriodChanged() {
    this.TeacherDataService.setCurrentPeriod(this.getPeriodByPeriodId(this.selectedPeriodId));
  }

  getNumberOfWorkgroupsInPeriod(periodId) {
    return this.StudentStatusService.getWorkgroupIdsOnNode(this.rootNodeId, periodId).length;
  }

  updateSelectedText() {
    this.selectedPeriodText =
      this.currentPeriod.periodId === -1
        ? $localize`All Periods`
        : $localize`Period: ${this.currentPeriod.periodName}`;
  }
}
