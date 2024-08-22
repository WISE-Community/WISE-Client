import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ConfigService } from './configService';
import { RunStatus } from '../common/RunStatus';
import { TeacherDataService } from './teacherDataService';

@Injectable()
export class RunStatusService {
  private runStatus: RunStatus;

  constructor(
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private http: HttpClient
  ) {
    this.configService.configRetrieved$.subscribe(() => {
      if (this.configService.isClassroomMonitor()) {
        this.retrieveRunStatus();
      }
    });
  }

  retrieveRunStatus(): Observable<RunStatus> {
    const options = {
      params: new HttpParams().set('runId', this.configService.getConfigParam('runId')),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };
    return this.http.get(this.configService.getConfigParam('runStatusURL'), options).pipe(
      tap((runStatus: RunStatus) => {
        this.runStatus = runStatus;
        this.initializePeriods();
      })
    );
  }

  private initializePeriods(): void {
    const periods = [...this.configService.getPeriods()];
    if (this.dataService.getCurrentPeriod() == null) {
      this.dataService.setCurrentPeriod(periods[0]);
    }
    periods.unshift({ periodId: -1, periodName: $localize`All Periods` });
    let mergedPeriods = periods;
    if (this.runStatus.periods != null) {
      mergedPeriods = this.mergeConfigAndRunStatusPeriods(periods, this.runStatus.periods);
    }
    this.runStatus.periods = mergedPeriods;
    this.dataService.setPeriods(mergedPeriods);
  }

  private mergeConfigAndRunStatusPeriods(configPeriods: any[], runStatusPeriods: any[]): any[] {
    const mergedPeriods = [];
    configPeriods.forEach((configPeriod) => {
      const runStatusPeriod = runStatusPeriods.find(
        (runStatusPeriod) => runStatusPeriod.periodId === configPeriod.periodId
      );
      mergedPeriods.push(runStatusPeriod != null ? runStatusPeriod : configPeriod);
    });
    return mergedPeriods;
  }

  getRunStatus(): RunStatus {
    return this.runStatus;
  }

  setRunStatus(runStatus: RunStatus): void {
    this.runStatus = runStatus;
  }

  saveRunStatus(): Observable<void> {
    const url = this.configService.getConfigParam('runStatusURL');
    const body = new HttpParams()
      .set('runId', this.configService.getConfigParam('runId'))
      .set('status', JSON.stringify(this.runStatus));
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };
    return this.http.post<void>(url, body, options);
  }

  createRunStatus(): RunStatus {
    const periods = this.configService.getPeriods();
    periods.forEach((period) => (period.paused = false));
    return {
      runId: this.configService.getConfigParam('runId'),
      periods: periods
    };
  }
}
