import { Component, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkgroupService } from '../../../../../app/services/workgroup.service';
import { ConfigService } from '../../../services/configService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [MatFormFieldModule, MatSelectModule],
  selector: 'select-period',
  styleUrl: 'select-period.component.scss',
  templateUrl: 'select-period.component.html'
})
export class SelectPeriodComponent {
  private currentPeriod: any;
  protected periods: any;
  protected selectedPeriodId: number;
  protected selectedPeriodText: string;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private workgroupService: WorkgroupService
  ) {}

  ngOnInit(): void {
    this.currentPeriod = this.dataService.getCurrentPeriod();
    this.selectedPeriodId = this.currentPeriod.periodId;
    this.updateSelectedText();
    this.periods = this.dataService.getPeriods();
    this.populateNumWorkgroupsInPeriod();
    this.tryHideAllPeriods();
    this.subscriptions.add(
      this.dataService.currentPeriodChanged$.subscribe(({ currentPeriod }) => {
        this.currentPeriod = currentPeriod;
        this.updateSelectedText();
      })
    );
    this.subscriptions.add(
      this.configService.configRetrieved$.subscribe(() => {
        if (this.configService.isClassroomMonitor()) {
          this.populateNumWorkgroupsInPeriod();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private populateNumWorkgroupsInPeriod(): void {
    let totalNumTeams = 0;
    for (const period of this.periods.slice(1)) {
      const numTeamsInPeriod = this.workgroupService.getWorkgroupsInPeriod(period.periodId).size;
      period.numWorkgroupsInPeriod = numTeamsInPeriod;
      totalNumTeams += numTeamsInPeriod;
    }
    this.periods[0].numWorkgroupsInPeriod = totalNumTeams; // all periods
  }

  // Don't show all periods if there is only one period in the run
  private tryHideAllPeriods(): void {
    if (this.periods.length === 2) {
      // this.periods contains all periods and the one period
      this.periods = this.periods.slice(1);
    }
  }

  protected currentPeriodChanged(): void {
    this.dataService.setCurrentPeriod(
      this.periods.find((period) => period.periodId === this.selectedPeriodId)
    );
  }

  private updateSelectedText(): void {
    this.selectedPeriodText =
      this.currentPeriod.periodId === -1
        ? $localize`All Periods`
        : $localize`Period: ${this.currentPeriod.periodName}`;
  }
}
