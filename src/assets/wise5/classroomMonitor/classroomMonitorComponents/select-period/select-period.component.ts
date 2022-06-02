'use strict';

import { Component, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkgroupService } from '../../../../../app/services/workgroup.service';
import { ConfigService } from '../../../services/configService';
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
    private ConfigService: ConfigService,
    private ProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService,
    private WorkgroupService: WorkgroupService
  ) {}

  ngOnInit() {
    const startNodeId = this.ProjectService.getStartNodeId();
    this.rootNodeId = this.ProjectService.getRootNode(startNodeId).id;
    this.currentPeriod = this.TeacherDataService.getCurrentPeriod();
    this.selectedPeriodId = this.currentPeriod.periodId;
    this.updateSelectedText();
    this.periods = this.TeacherDataService.getPeriods();
    this.populateNumWorkgroupsInPeriod();
    this.tryHideAllPeriods();
    this.subscriptions.add(
      this.TeacherDataService.currentPeriodChanged$.subscribe(({ currentPeriod }) => {
        this.currentPeriod = currentPeriod;
        this.updateSelectedText();
      })
    );
    this.subscriptions.add(
      this.ConfigService.configRetrieved$.subscribe(() => {
        if (this.ConfigService.isClassroomMonitor()) {
          this.populateNumWorkgroupsInPeriod();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  populateNumWorkgroupsInPeriod() {
    let totalNumTeams = 0;
    for (const period of this.periods.slice(1)) {
      const numTeamsInPeriod = this.getNumberOfWorkgroupsInPeriod(period.periodId);
      period.numWorkgroupsInPeriod = numTeamsInPeriod;
      totalNumTeams += numTeamsInPeriod;
    }
    this.periods[0].numWorkgroupsInPeriod = totalNumTeams; // all periods
  }

  /**
   * Don't show all periods if there is only one period in the run
   */
  tryHideAllPeriods() {
    if (this.periods.length === 2) {
      // this.periods contains all periods and the one period
      this.periods = this.periods.slice(1);
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

  getNumberOfWorkgroupsInPeriod(periodId: number): number {
    return this.WorkgroupService.getWorkgroupsInPeriod(periodId).size;
  }

  updateSelectedText() {
    this.selectedPeriodText =
      this.currentPeriod.periodId === -1
        ? $localize`All Periods`
        : $localize`Period: ${this.currentPeriod.periodName}`;
  }
}
