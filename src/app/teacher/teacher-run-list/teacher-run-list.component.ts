import { Component, EventEmitter, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { TeacherService } from '../teacher.service';
import { TeacherRun } from '../teacher-run';
import { ConfigService } from '../../services/config.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { mergeMap } from 'rxjs/operators';
import { ArchiveProjectService } from '../../services/archive-project.service';
import { runSpansDays } from '../../../assets/wise5/common/datetime/datetime';
import { SelectRunsOption } from '../select-runs-controls/select-runs-option';
import { sortByRunStartTimeDesc } from '../../domain/run';
import { Project } from '../../domain/project';

@Component({
  selector: 'app-teacher-run-list',
  templateUrl: './teacher-run-list.component.html',
  styleUrls: ['./teacher-run-list.component.scss']
})
export class TeacherRunListComponent implements OnInit {
  private MAX_RECENT_RUNS = 10;

  protected allRunsLoaded: boolean = false;
  protected filteredRuns: TeacherRun[] = [];
  protected filterValue: string = '';
  protected numSelectedRuns: number = 0;
  protected recentRunsLoaded: boolean = false;
  protected runChangedEventEmitter: EventEmitter<void> = new EventEmitter<void>();
  protected runs: TeacherRun[] = [];
  protected searchValue: string = '';
  protected showAll: boolean = false;
  protected showArchivedView: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private archiveProjectService: ArchiveProjectService,
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
    this.subscribeToRefreshProjects();
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
        this.allRunsLoaded = true;
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
      teacherRun.project.archived = teacherRun.project.tags.includes('archived');
      return teacherRun;
    });
    this.filteredRuns = this.runs;
    this.recentRunsLoaded = true;
  }

  private subscribeToRuns(): void {
    this.subscriptions.add(
      this.teacherService.runs$.subscribe((run: TeacherRun) => {
        this.updateExistingRun(run);
      })
    );
  }

  private subscribeToRefreshProjects(): void {
    this.subscriptions.add(
      this.archiveProjectService.refreshProjectsEvent$.subscribe(() => {
        this.runArchiveStatusChanged();
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
    return sortByRunStartTimeDesc(a, b);
  }

  protected runSpansDays(run: TeacherRun): boolean {
    return runSpansDays(run, this.localeID);
  }

  protected activeTotal(): number {
    return this.getTotal('isActive');
  }

  protected completedTotal(): number {
    const now = this.configService.getCurrentServerTime();
    return this.filteredRuns.filter(
      (run: TeacherRun) => !run.isActive(now) && !run.isScheduled(now)
    ).length;
  }

  protected scheduledTotal(): number {
    return this.getTotal('isScheduled');
  }

  private getTotal(filterFunctionName: string): number {
    const now = this.configService.getCurrentServerTime();
    return this.filteredRuns.filter((run: TeacherRun) => run[filterFunctionName](now)).length;
  }

  private performSearchAndFilter(): void {
    this.filteredRuns = this.searchValue ? this.performSearch(this.searchValue) : this.runs;
    this.performFilter();
    this.unselectAllRuns();
    this.runSelectedStatusChanged();
  }

  protected searchChanged(searchValue: string): void {
    this.searchValue = searchValue;
    this.performSearchAndFilter();
  }

  private performFilter(): void {
    this.filteredRuns = this.filteredRuns.filter(
      (run: TeacherRun) =>
        (!this.showArchivedView && !run.project.archived) ||
        (this.showArchivedView && run.project.archived)
    );
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
      run.project.selected = false;
    }
  }

  protected selectRunsOptionChosen(option: SelectRunsOption): void {
    const now = this.configService.getCurrentServerTime();
    this.filteredRuns.forEach((run: TeacherRun) => run.updateSelected(option, now));
    this.runSelectedStatusChanged();
  }

  protected refreshProjects(): void {
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

  protected archiveProjects(archive: boolean): void {
    this.archiveProjectService.archiveProjects(this.getSelectedProjects(), archive);
  }

  private getSelectedProjects(): Project[] {
    return this.filteredRuns
      .filter((run: TeacherRun) => run.project.selected)
      .map((run: TeacherRun) => run.project);
  }
}
