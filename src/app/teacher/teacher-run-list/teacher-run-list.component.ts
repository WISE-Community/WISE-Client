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
  filterOptions: any[];
  filterValue: string = '';
  isSelectedAllRuns: boolean = false;
  isSelectedSomeRuns: boolean = false;
  isShowArchived: boolean = false;
  numSelectedRuns: number = 0;
  showAll: boolean = false;
  subscriptions: Subscription = new Subscription();

  constructor(
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
      teacherRun.isArchived = teacherRun.project.tags.includes('archived');
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

  sortByStartTimeDesc(a: TeacherRun, b: TeacherRun): number {
    return b.startTime - a.startTime;
  }

  runSpansDays(run: TeacherRun): boolean {
    const startDay = formatDate(run.startTime, 'shortDate', this.localeID);
    const endDay = formatDate(run.endTime, 'shortDate', this.localeID);
    return startDay != endDay;
  }

  activeTotal(): number {
    const now = this.configService.getCurrentServerTime();
    return this.filteredRuns.filter((run: TeacherRun) => run.isActive(now)).length;
  }

  completedTotal(): number {
    const now = this.configService.getCurrentServerTime();
    return this.filteredRuns.filter(
      (run: TeacherRun) => !run.isActive(now) && !run.isScheduled(now)
    ).length;
  }

  scheduledTotal(): number {
    const now = this.configService.getCurrentServerTime();
    return this.filteredRuns.filter((run: TeacherRun) => run.isScheduled(now)).length;
  }

  private performSearchAndFilter(): void {
    this.filteredRuns = this.searchValue ? this.performSearch(this.searchValue) : this.runs;
    this.performFilter();
    this.updateNumSelectedRuns();
  }

  searchChanged(searchValue: string): void {
    this.searchValue = searchValue;
    this.performSearchAndFilter();
    this.turnOnShowAll();
  }

  filterChanged(value: string): void {
    this.filterValue = value;
    this.performSearchAndFilter();
  }

  private performFilter(): void {
    this.filteredRuns = this.filteredRuns.filter((run: TeacherRun) => {
      return (!this.isShowArchived && !run.isArchived) || (this.isShowArchived && run.isArchived);
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

  reset(): void {
    this.searchValue = '';
    this.filterValue = '';
    this.performSearchAndFilter();
  }

  isRunActive(run: TeacherRun): boolean {
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
        run.isHighlighted = true;
      }
    }
  }

  isShowArchivedChanged(): void {
    this.turnOnShowAll();
    this.unselectAllRuns();
    this.updateSelectAllCheckboxAndNumRunsSelected();
    this.performSearchAndFilter();
  }

  selectAllRunsCheckboxClicked(event: any): void {
    this.turnOnShowAll();
    if (this.isSelectedAllRuns || this.isSelectedSomeRuns) {
      this.unselectAllRuns();
    } else {
      this.selectAllFilteredRuns();
    }
    this.updateSelectAllCheckboxAndNumRunsSelected();
    event.preventDefault();
  }

  private unselectAllRuns(): void {
    this.isSelectedAllRuns = false;
    this.isSelectedSomeRuns = false;
    for (const run of this.runs) {
      run.isSelected = false;
    }
  }

  private selectAllFilteredRuns(): void {
    this.filteredRuns
      .filter((run: TeacherRun) => !run.shared)
      .forEach((run: TeacherRun) => {
        run.isSelected = true;
      });
  }

  selectRunsOptionChosen(value: string): void {
    this.turnOnShowAll();
    this.isSelectedAllRuns = value === 'all';
    this.isSelectedAllRuns = value === 'none';
    this.filteredRuns
      .filter((run: TeacherRun) => !run.shared)
      .forEach((run: TeacherRun) => {
        switch (value) {
          case 'all':
            run.isSelected = true;
            break;
          case 'none':
            run.isSelected = false;
            break;
          case 'running':
            run.isSelected = !run.isCompleted(this.configService.getCurrentServerTime());
            break;
          case 'completed':
            run.isSelected = run.isCompleted(this.configService.getCurrentServerTime());
            break;
        }
      });
    this.updateSelectAllCheckboxAndNumRunsSelected();
  }

  private updateSelectAllCheckboxAndNumRunsSelected(): void {
    this.updateSelectAllCheckbox();
    this.updateNumSelectedRuns();
  }

  private updateSelectAllCheckbox(): void {
    const numFilteredRuns = this.filteredRuns.length;
    const numSelectedRuns = this.getNumSelectedRuns();
    this.isSelectedAllRuns = numSelectedRuns > 0 && numSelectedRuns === numFilteredRuns;
    this.isSelectedSomeRuns = numSelectedRuns > 0 && numSelectedRuns !== numFilteredRuns;
  }

  private updateNumSelectedRuns(): void {
    this.numSelectedRuns = this.getNumSelectedRuns();
  }

  private getNumSelectedRuns(): number {
    return this.getSelectedRuns().length;
  }

  archiveSelectedRuns(): Subscription {
    const runs = this.getSelectedRuns();
    return this.teacherService.archiveRuns(runs).subscribe({
      next: () => {
        this.setRunsIsArchived(runs, true);
        this.unselectAllRuns();
        this.updateSelectAllCheckboxAndNumRunsSelected();
        this.performSearchAndFilter();
        this.snackBar.open($localize`Successfully Archived ${runs.length} Runs`);
      },
      error: () => {
        this.snackBar.open($localize`Error Archiving Runs`);
      }
    });
  }

  unarchiveSelectedRuns(): Subscription {
    const runs = this.getSelectedRuns();
    return this.teacherService.unarchiveRuns(runs).subscribe({
      next: () => {
        this.setRunsIsArchived(runs, false);
        this.unselectAllRuns();
        this.updateSelectAllCheckboxAndNumRunsSelected();
        this.performSearchAndFilter();
        this.snackBar.open($localize`Successfully Unarchived ${runs.length} Runs`);
      },
      error: () => {
        this.snackBar.open($localize`Error Unarchiving Runs`);
      }
    });
  }

  private setRunsIsArchived(runs: TeacherRun[], isArchived: boolean): void {
    for (const run of runs) {
      run.isArchived = isArchived;
    }
  }

  runSelectedStatusChanged(): void {
    this.updateSelectAllCheckboxAndNumRunsSelected();
  }

  runArchiveStatusChanged(): void {
    this.performSearchAndFilter();
  }

  private getSelectedRuns(): TeacherRun[] {
    return this.filteredRuns.filter((run: TeacherRun) => {
      return run.isSelected;
    });
  }

  private turnOnShowAll(): void {
    this.showAll = true;
  }
}
