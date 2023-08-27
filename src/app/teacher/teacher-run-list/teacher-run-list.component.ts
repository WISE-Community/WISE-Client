import { Component, EventEmitter, Inject, LOCALE_ID, OnInit } from '@angular/core';
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
  private MAX_RECENT_RUNS = 10;

  protected filteredRuns: TeacherRun[] = [];
  protected filterValue: string = '';
  protected loaded: boolean = false;
  protected numSelectedRuns: number = 0;
  protected runChangedEventEmitter: EventEmitter<void> = new EventEmitter<void>();
  protected runs: TeacherRun[] = [];
  protected searchValue: string = '';
  protected showAll: boolean = false;
  protected showArchived: boolean = false;
  private subscriptions: Subscription = new Subscription();

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
        this.highlightNewRunIfNecessary();
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
      teacherRun.archived = teacherRun.project.tags.includes('archived');
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
    this.performSearchAndFilter();
  }

  protected sortByStartTimeDesc(a: TeacherRun, b: TeacherRun): number {
    return b.startTime - a.startTime;
  }

  protected runSpansDays(run: TeacherRun): boolean {
    const startDay = formatDate(run.startTime, 'shortDate', this.localeID);
    const endDay = formatDate(run.endTime, 'shortDate', this.localeID);
    return startDay != endDay;
  }

  protected activeTotal(): number {
    const now = this.configService.getCurrentServerTime();
    return this.filteredRuns.filter((run: TeacherRun) => run.isActive(now)).length;
  }

  protected completedTotal(): number {
    const now = this.configService.getCurrentServerTime();
    return this.filteredRuns.filter(
      (run: TeacherRun) => !run.isActive(now) && !run.isScheduled(now)
    ).length;
  }

  protected scheduledTotal(): number {
    const now = this.configService.getCurrentServerTime();
    return this.filteredRuns.filter((run: TeacherRun) => run.isScheduled(now)).length;
  }

  private performSearchAndFilter(): void {
    this.filteredRuns = this.searchValue ? this.performSearch(this.searchValue) : this.runs;
    this.performFilter();
    this.runSelectedStatusChanged();
  }

  protected searchChanged(searchValue: string): void {
    this.searchValue = searchValue;
    this.performSearchAndFilter();
  }

  private performFilter(): void {
    this.filteredRuns = this.filteredRuns.filter((run: TeacherRun) => {
      return (!this.showArchived && !run.archived) || (this.showArchived && run.archived);
    });
  }

  private performSearch(searchValue: string): TeacherRun[] {
    searchValue = searchValue.toLocaleLowerCase();
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

  protected clearFilters(event: Event): void {
    event.preventDefault();
    this.reset();
  }

  protected reset(): void {
    this.searchValue = '';
    this.filterValue = '';
    this.performSearchAndFilter();
  }

  protected isRunActive(run: TeacherRun): boolean {
    return run.isActive(this.configService.getCurrentServerTime());
  }

  private highlightNewRunIfNecessary(): void {
    this.route.queryParams.subscribe((queryParams: Params) => {
      if (queryParams.newRunId != null) {
        const newRunId = parseInt(queryParams.newRunId);
        if (!isNaN(newRunId)) {
          this.highlightNewRun(newRunId);
        }
        // remove the newRunId parameter from the url
        this.router.navigate(['/teacher/home/schedule'], { queryParams: { newRunId: null } });
      }
    });
  }

  private highlightNewRun(runId: number): void {
    for (const run of this.runs) {
      if (run.id === runId) {
        run.highlighted = true;
      }
    }
  }

  private unselectAllRuns(): void {
    for (const run of this.runs) {
      run.selected = false;
    }
  }

  protected selectRunsOptionChosen(value: string): void {
    this.filteredRuns.forEach((run: TeacherRun) => {
      switch (value) {
        case 'all':
          run.selected = true;
          break;
        case 'none':
          run.selected = false;
          break;
        case 'running':
          run.selected = !run.isCompleted(this.configService.getCurrentServerTime());
          break;
        case 'completed':
          run.selected = run.isCompleted(this.configService.getCurrentServerTime());
          break;
      }
    });
    this.runSelectedStatusChanged();
  }

  protected updateRunsInformation(): void {
    this.unselectAllRuns();
    this.runSelectedStatusChanged();
    this.performSearchAndFilter();
  }

  protected runArchiveStatusChanged(): void {
    this.performSearchAndFilter();
  }

  private runSelectedStatusChanged(): void {
    this.runChangedEventEmitter.emit();
  }
}
