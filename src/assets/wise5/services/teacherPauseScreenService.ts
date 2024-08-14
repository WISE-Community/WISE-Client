import { Injectable } from '@angular/core';
import { TeacherDataService } from './teacherDataService';
import { TeacherWebSocketService } from './teacherWebSocketService';

@Injectable()
export class TeacherPauseScreenService {
  constructor(
    private teacherDataService: TeacherDataService,
    private teacherWebSocketService: TeacherWebSocketService
  ) {}

  /**
   * The pause screen status was changed for the given periodId. Update period accordingly.
   * @param periodId the id of the period to toggle
   * @param isPaused Boolean whether the period should be paused or not
   */
  pauseScreensChanged(periodId: number, isPaused: boolean): void {
    this.updatePausedRunStatusValue(periodId, isPaused);
    this.saveRunStatusThenHandlePauseScreen(periodId, isPaused);
    const context = 'ClassroomMonitor',
      nodeId = null,
      componentId = null,
      componentType = null,
      category = 'TeacherAction',
      data = { periodId: periodId },
      event = isPaused ? 'pauseScreen' : 'unPauseScreen';
    this.teacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      event,
      data
    );
  }

  private saveRunStatusThenHandlePauseScreen(periodId: number, isPaused: boolean): void {
    this.teacherDataService.saveRunStatus().subscribe(() => {
      if (isPaused) {
        this.teacherWebSocketService.pauseScreens(periodId);
      } else {
        this.teacherWebSocketService.unPauseScreens(periodId);
      }
    });
  }

  /**
   * Update the paused value for a period in our run status
   * @param periodId the period id or -1 for all periods
   * @param isPaused whether the period is paused or not
   */
  private updatePausedRunStatusValue(periodId: number, isPaused: boolean): void {
    if (this.teacherDataService.getRunStatus() == null) {
      this.teacherDataService.setRunStatus(this.teacherDataService.createRunStatus());
    }
    if (periodId === -1) {
      this.updateAllPeriodsPausedValue(isPaused);
    } else {
      this.updatePeriodPausedValue(periodId, isPaused);
    }
  }

  private updateAllPeriodsPausedValue(isPaused: boolean): void {
    for (const period of this.teacherDataService.getRunStatus().periods) {
      period.paused = isPaused;
    }
  }

  private updatePeriodPausedValue(periodId: number, isPaused: boolean): void {
    for (const period of this.teacherDataService.getRunStatus().periods) {
      if (period.periodId === periodId) {
        period.paused = isPaused;
      }
    }
  }
}
