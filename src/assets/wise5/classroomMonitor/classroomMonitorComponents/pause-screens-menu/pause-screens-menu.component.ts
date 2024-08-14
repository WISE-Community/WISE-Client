import { Component } from '@angular/core';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherPauseScreenService } from '../../../services/teacherPauseScreenService';

class Period {
  paused: boolean;
  periodId: number;
}

@Component({
  selector: 'pause-screens-menu',
  styleUrls: ['./pause-screens-menu.component.scss'],
  templateUrl: './pause-screens-menu.component.html'
})
export class PauseScreensMenuComponent {
  allPeriodsPaused: boolean;
  periods: Period[];

  constructor(
    private dataService: TeacherDataService,
    private pauseScreenService: TeacherPauseScreenService
  ) {
    this.periods = this.dataService.getPeriods().filter((period) => period.periodId !== -1);
  }

  togglePeriod(period: Period): void {
    this.pauseScreenService.pauseScreensChanged(period.periodId, period.paused);
  }

  toggleAllPeriods(): void {
    this.periods.forEach((period) => {
      this.pauseScreenService.pauseScreensChanged(period.periodId, this.allPeriodsPaused);
    });
  }
}
