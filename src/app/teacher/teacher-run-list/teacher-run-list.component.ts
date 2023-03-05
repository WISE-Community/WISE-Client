import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { TeacherService } from '../teacher.service';
import { TeacherRun } from '../teacher-run';
import { ConfigService } from '../../services/config.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { Observable, of, Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-teacher-run-list',
  templateUrl: './teacher-run-list.component.html',
  styleUrls: ['./teacher-run-list.component.scss']
})
export class TeacherRunListComponent implements OnInit {
  MAX_RECENT_RUNS = 10;

  runs: TeacherRun[] = [];
  filteredRuns: TeacherRun[] = [];
  loaded: boolean = false;
  searchValue: string = '';
  periods: string[] = [];
  filterOptions: any[];
  filterValue: string = '';
  showAll: boolean = false;
  subscriptions: Subscription = new Subscription();

  constructor(
    private configService: ConfigService,
    @Inject(LOCALE_ID) private localeID: string,
    private route: ActivatedRoute,
    private router: Router,
    private teacherService: TeacherService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getRuns();
    this.subscribeToRuns();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private getRuns(): void {
    this.teacherService
      .getRuns(this.MAX_RECENT_RUNS)
      .pipe(mergeMap((runs) => this.processRecentRuns(runs)))
      .subscribe((runs: TeacherRun[]) => {
        this.setRuns(runs);
        this.processRuns();
        this.loaded = true;
      });
  }

  private processRecentRuns(runs: TeacherRun[]): Observable<TeacherRun[]> {
    if (runs.length < this.MAX_RECENT_RUNS) {
      return of(runs);
    } else {
      this.setRuns(runs);
      return this.teacherService.getRuns();
    }
  }

  private setRuns(runs: TeacherRun[]): void {
    const userId = this.userService.getUserId();
    this.runs = runs.map((run) => {
      const teacherRun = new TeacherRun(run);
      teacherRun.shared = !teacherRun.isOwner(userId);
      return teacherRun;
    });
    this.filteredRuns = this.runs;
  }

  private subscribeToRuns(): void {
    this.subscriptions.add(
      this.teacherService.runs$.subscribe((run: TeacherRun) => {
        this.updateExistingRun(run);
      })
    );
  }

  private updateExistingRun(updatedRun: TeacherRun): void {
    const runIndex = this.runs.findIndex((run) => run.id === updatedRun.id);
    this.runs.splice(runIndex, 1, updatedRun);
    this.processRuns();
    this.reset();
  }

  private processRuns(): void {
    this.filteredRuns = this.runs;
    this.populatePeriods();
    this.periods.sort();
    this.populateFilterOptions();
    this.performSearchAndFilter();
    this.highlightNewRun();
  }

  sortByStartTimeDesc(a: TeacherRun, b: TeacherRun): number {
    return b.startTime - a.startTime;
  }

  private populatePeriods(): void {
    this.periods = [];
    for (const run of this.runs) {
      for (const period of run.periods) {
        if (!this.periods.includes(period)) {
          this.periods.push(period);
        }
      }
    }
  }

  private populateFilterOptions(): void {
    this.filterOptions = [{ value: '', label: $localize`All Periods` }];
    for (const period of this.periods) {
      this.filterOptions.push({ value: period, label: period });
    }
  }

  runSpansDays(run: TeacherRun) {
    const startDay = formatDate(run.startTime, 'shortDate', this.localeID);
    const endDay = formatDate(run.endTime, 'shortDate', this.localeID);
    return startDay != endDay;
  }

  activeTotal(): number {
    let total = 0;
    const now = this.configService.getCurrentServerTime();
    for (const run of this.filteredRuns) {
      if (run.isActive(now)) {
        total++;
      }
    }
    return total;
  }

  scheduledTotal(): number {
    let total = 0;
    const now = this.configService.getCurrentServerTime();
    for (const run of this.filteredRuns) {
      if (run.isScheduled(now)) {
        total++;
      }
    }
    return total;
  }

  private performSearchAndFilter(): void {
    this.filteredRuns = this.searchValue ? this.performSearch(this.searchValue) : this.runs;
    this.performFilter(this.filterValue);
  }

  searchChanged(searchValue: string): void {
    this.searchValue = searchValue;
    this.performSearchAndFilter();
  }

  filterChanged(value: string): void {
    this.filterValue = value;
    this.performSearchAndFilter();
  }

  private performFilter(value: string): void {
    this.filteredRuns = this.filteredRuns.filter((run: TeacherRun) => {
      return value === '' || run.periods.includes(value);
    });
  }

  private performSearch(searchValue: string) {
    searchValue = searchValue.toLocaleLowerCase();
    // TODO: extract this for global use?
    return this.runs.filter((run: TeacherRun) =>
      Object.keys(run).some((prop) => {
        const value = run[prop];
        if (typeof value === 'undefined' || value === null) {
          return false;
        } else if (typeof value === 'object') {
          return JSON.stringify(value).toLocaleLowerCase().indexOf(searchValue) !== -1;
        } else {
          return value.toString().toLocaleLowerCase().indexOf(searchValue) !== -1;
        }
      })
    );
  }

  reset(): void {
    this.searchValue = '';
    this.filterValue = '';
    this.performSearchAndFilter();
  }

  isRunActive(run) {
    return run.isActive(this.configService.getCurrentServerTime());
  }

  private highlightNewRun(): void {
    this.route.queryParams.subscribe((queryParams: Params) => {
      if (queryParams.newRunId != null) {
        const newRunId = parseInt(queryParams.newRunId);
        if (newRunId != null) {
          const newRun = this.runs.find((run) => {
            return run.id === newRunId;
          });
          newRun.isHighlighted = true;
          // remove the newRunId parameter from the url
          this.router.navigate(['/teacher/home/schedule'], { queryParams: { newRunId: null } });
        }
      }
    });
  }
}
