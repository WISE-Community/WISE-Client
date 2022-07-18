import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { TeacherService } from '../teacher.service';
import { TeacherRun } from '../teacher-run';
import { ConfigService } from '../../services/config.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-teacher-run-list',
  templateUrl: './teacher-run-list.component.html',
  styleUrls: ['./teacher-run-list.component.scss']
})
export class TeacherRunListComponent implements OnInit {
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
    private teacherService: TeacherService,
    private configService: ConfigService,
    private router: Router,
    @Inject(LOCALE_ID) private localeID: string
  ) {}

  ngOnInit() {
    this.getRuns();
    this.subscribeToRuns();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private getRuns(): void {
    forkJoin([this.teacherService.getRuns(), this.teacherService.getSharedRuns()]).subscribe(
      ([personalRuns, sharedRuns]) => {
        personalRuns = personalRuns.map((run) => new TeacherRun(run));
        sharedRuns = sharedRuns.map((run) => {
          const sharedRun = new TeacherRun(run);
          sharedRun.shared = true;
          return sharedRun;
        });
        this.runs = personalRuns.concat(sharedRuns);
        this.processRuns();
        this.loaded = true;
      }
    );
  }

  private subscribeToRuns(): void {
    this.subscriptions.add(
      this.teacherService.runs$.subscribe((run: TeacherRun) => {
        if (this.isNewRun(run)) {
          this.addNewRun(run);
        } else {
          this.updateExistingRun(run);
        }
      })
    );
  }

  private addNewRun(newRun: TeacherRun): void {
    newRun.isHighlighted = true;
    this.runs.unshift(newRun);
    this.runs.sort(this.sortByStartTimeDesc);
    this.populatePeriods();
    this.periods.sort();
    this.populateFilterOptions();
    this.reset();
    if (!this.showAll) {
      const index = this.getRunIndex(newRun);
      if (index > 9) {
        this.showAll = true;
      }
    }
    this.router.navigateByUrl('teacher/home/schedule').then(() => {
      setTimeout(() => {
        document.getElementById(`run${newRun.id}`).scrollIntoView();
      }, 1000);
    });
  }

  private updateExistingRun(updatedRun: TeacherRun): void {
    const runIndex = this.runs.findIndex((run) => run.id === updatedRun.id);
    this.runs.splice(runIndex, 1, updatedRun);
    this.processRuns();
    this.reset();
  }

  private isNewRun(run: TeacherRun) {
    return !this.runs.some((existingRun) => existingRun.id === run.id);
  }

  private getRunIndex(run: TeacherRun): number {
    for (let i = 0; i < this.runs.length; i++) {
      if (this.runs[i].id === run.id) {
        return i;
      }
    }
    return null;
  }

  private processRuns(): void {
    this.filteredRuns = this.runs;
    this.populatePeriods();
    this.periods.sort();
    this.populateFilterOptions();
    this.performSearchAndFilter();
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
}
