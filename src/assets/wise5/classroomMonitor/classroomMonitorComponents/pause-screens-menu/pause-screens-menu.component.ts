import { Component, inject } from '@angular/core';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherPauseScreenService } from '../../../services/teacherPauseScreenService';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';

class Period {
  paused: boolean;
  periodId: number;
  periodName: string;
}

@Component({
  imports: [FormsModule, MatDividerModule, MatIconModule, MatSlideToggleModule, MatToolbarModule],
  selector: 'pause-screens-menu',
  styleUrl: './pause-screens-menu.component.scss',
  templateUrl: './pause-screens-menu.component.html'
})
export class PauseScreensMenuComponent {
  private dataService = inject(TeacherDataService);
  private pauseScreenService = inject(TeacherPauseScreenService);

  protected allPeriodsPaused: boolean;
  protected periods: Period[];

  constructor() {
    this.periods = this.dataService.getPeriods().filter((period) => period.periodId !== -1);
  }

  protected togglePeriod(period: Period): void {
    this.pauseScreenService.pauseScreensChanged(period.periodId, period.paused);
  }

  protected toggleAllPeriods(): void {
    this.periods.forEach((period) => {
      this.pauseScreenService.pauseScreensChanged(period.periodId, this.allPeriodsPaused);
    });
  }
}
