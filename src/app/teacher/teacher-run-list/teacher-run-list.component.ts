import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { TeacherService } from '../teacher.service';
import { TeacherRun } from '../teacher-run';
import { ConfigService } from '../../services/config.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { Observable, of, Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { mergeMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArchiveProjectService } from '../../services/archive-project.service';
import { Project } from '../../domain/project';
import { ArchiveProjectResponse } from '../../domain/archiveProjectResponse';

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
  protected runs: TeacherRun[] = [];
  protected searchValue: string = '';
  protected showAll: boolean = false;
  protected showArchived: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private archiveProjectService: ArchiveProjectService,
    private configService: ConfigService,
    @Inject(LOCALE_ID) private localeID: string,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
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
    this.updateNumSelectedRuns();
  }

  protected searchChanged(searchValue: string): void {
    this.searchValue = searchValue;
    this.performSearchAndFilter();
    this.turnOnShowAll();
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

  protected isShowArchivedChanged(): void {
    this.turnOnShowAll();
    this.unselectAllRuns();
    this.updateNumSelectedRuns();
    this.performSearchAndFilter();
  }

  private unselectAllRuns(): void {
    for (const run of this.runs) {
      run.selected = false;
    }
  }

  protected selectRunsOptionChosen(value: string): void {
    this.turnOnShowAll();
    this.filteredRuns
      .filter((run: TeacherRun) => !run.shared)
      .forEach((run: TeacherRun) => {
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
    this.updateNumSelectedRuns();
  }

  private updateNumSelectedRuns(): void {
    this.numSelectedRuns = this.getSelectedRuns().length;
  }

  protected archiveSelectedRuns(): Subscription {
    const runs = this.getSelectedRuns();
    return this.archiveProjectService.archiveProjects(this.getProjects(runs)).subscribe({
      next: (archiveProjectsResponse: ArchiveProjectResponse[]) => {
        this.updateRunsArchivedStatus(runs, archiveProjectsResponse);
        this.updateRunsInformation();
        this.snackBar.open(
          $localize`Successfully Archived ${
            archiveProjectsResponse.filter((response) => response.archived).length
          } Units`
        );
      },
      error: () => {
        this.snackBar.open($localize`Error Archiving Units`);
      }
    });
  }

  protected unarchiveSelectedRuns(): Subscription {
    const runs = this.getSelectedRuns();
    return this.archiveProjectService.unarchiveProjects(this.getProjects(runs)).subscribe({
      next: (archiveProjectsResponse: ArchiveProjectResponse[]) => {
        this.updateRunsArchivedStatus(runs, archiveProjectsResponse);
        this.updateRunsInformation();
        this.snackBar.open(
          $localize`Successfully Unarchived ${
            archiveProjectsResponse.filter((response) => !response.archived).length
          } Units`
        );
      },
      error: () => {
        this.snackBar.open($localize`Error Unarchiving Units`);
      }
    });
  }

  private updateRunsArchivedStatus(
    runs: TeacherRun[],
    archiveProjectsResponse: ArchiveProjectResponse[]
  ): void {
    for (const archiveProjectResponse of archiveProjectsResponse) {
      const run = runs.find((run: TeacherRun) => run.project.id === archiveProjectResponse.id);
      run.archived = archiveProjectResponse.archived;
    }
  }

  private updateRunsInformation(): void {
    this.unselectAllRuns();
    this.updateNumSelectedRuns();
    this.performSearchAndFilter();
  }

  private getProjects(runs: TeacherRun[]): Project[] {
    return runs.map((run: TeacherRun) => run.project);
  }

  protected runSelectedStatusChanged(): void {
    this.updateNumSelectedRuns();
  }

  protected runArchiveStatusChanged(): void {
    this.performSearchAndFilter();
  }

  private getSelectedRuns(): TeacherRun[] {
    return this.filteredRuns.filter((run: TeacherRun) => {
      return run.selected;
    });
  }

  private turnOnShowAll(): void {
    this.showAll = true;
  }
}
