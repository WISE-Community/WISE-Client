// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { defer, Observable, of } from 'rxjs';
import { TeacherRunListComponent } from './teacher-run-list.component';
import { TeacherService } from '../teacher.service';
import { Project } from '../../domain/project';
import { TeacherRun } from '../teacher-run';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../services/user.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../domain/user';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class TeacherScheduleStubComponent {}

export function fakeAsyncResponse<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

export class MockTeacherService {
  archiveRuns(): Observable<any[]> {
    return of([]);
  }
  unarchiveRuns(): Observable<any[]> {
    return of([]);
  }
  getRuns(): Observable<TeacherRun[]> {
    const runs: TeacherRun[] = [];
    const run1 = new TeacherRun();
    run1.id = 1;
    run1.name = 'Photosynthesis';
    run1.numStudents = 30;
    run1.periods = ['1', '2'];
    run1.startTime = new Date('2018-01-01T00:00:00.0').getTime();
    const project1 = new Project();
    project1.id = 1;
    project1.name = 'Photosynthesis';
    project1.projectThumb = '';
    run1.project = project1;
    const run2 = new TeacherRun();
    run2.id = 2;
    run2.name = 'Plate Tectonics';
    run2.numStudents = 15;
    run2.periods = ['3', '4'];
    run2.startTime = new Date('2018-03-03T00:00:00.0').getTime();
    const project2 = new Project();
    project2.id = 1;
    project2.name = 'Plate Tectonics';
    project2.projectThumb = '';
    run2.project = project2;
    runs.push(run1);
    runs.push(run2);
    return Observable.create((observer) => {
      observer.next(runs);
      observer.complete();
    });
  }
  runs$ = fakeAsyncResponse({
    id: 3,
    name: 'Global Climate Change',
    periods: ['1', '2']
  });
}

export class MockConfigService {
  getCurrentServerTime(): number {
    return new Date('2018-08-24T00:00:00.0').getTime();
  }
}

export class MockUserService {
  getUserId(): number {
    return 1;
  }
}

let component: TeacherRunListComponent;
let configService: ConfigService;
const currentTime = new Date().getTime();
const dummyClickEvent: any = { preventDefault: () => {} };
let fixture: ComponentFixture<TeacherRunListComponent>;
let run1: TeacherRun;
let run2: TeacherRun;
let run3: TeacherRun;
let teacherService: TeacherService;

function createRun(id: number, ownerId: number): TeacherRun {
  return new TeacherRun({
    id: id,
    project: { id: id, tags: [] },
    owner: new User({ id: ownerId }),
    isArchived: false
  });
}

describe('TeacherRunListComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TeacherRunListComponent],
        imports: [
          BrowserAnimationsModule,
          RouterTestingModule.withRoutes([
            { path: 'teacher/home/schedule', component: TeacherScheduleStubComponent }
          ]),
          MatSnackBarModule
        ],
        providers: [
          { provide: TeacherService, useClass: MockTeacherService },
          { provide: ConfigService, useClass: MockConfigService },
          { provide: UserService, useClass: MockUserService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherRunListComponent);
    configService = TestBed.inject(ConfigService);
    teacherService = TestBed.inject(TeacherService);
    component = fixture.componentInstance;
    spyOn(teacherService, 'getRuns').and.returnValue(
      of([createRun(1, 1), createRun(2, 1), createRun(3, 1)])
    );
    spyOn(configService, 'getCurrentServerTime').and.returnValue(currentTime);
    fixture.detectChanges();
    run1 = component.runs[0];
    run2 = component.runs[1];
    run3 = component.runs[2];
  });

  archiveSelectedRuns();
  isShowArchiveChanged();
  runArchiveStatusChanged();
  runSelectedStatusChanged();
  selectRunsOptionChosen();
  sortByStartTimeDesc();
  unarchiveSelectedRuns();
});

function sortByStartTimeDesc() {
  describe('sortByStartTimeDesc()', () => {
    it('should sort runs by start date', () => {
      const run3 = new TeacherRun();
      run3.id = 3;
      run3.name = 'Planet Earth';
      run3.numStudents = 10;
      run3.periods = ['6', '7'];
      run3.startTime = new Date('2018-02-02T00:00:00.0').getTime();
      const project3 = new Project();
      project3.id = 1;
      project3.name = 'Planet Earth';
      project3.projectThumb = '';
      run3.project = project3;
      component.runs.push(run3);
      component.runs.sort(component.sortByStartTimeDesc);
      expect(isRunsSortedByStartTimeDesc(component.runs)).toBeTruthy();
    });
  });
}

function isRunsSortedByStartTimeDesc(runs: TeacherRun[]): boolean {
  let previous: number = null;
  for (let run of runs) {
    let current = run.startTime;
    if (previous && previous < current) {
      return false;
    }
    previous = current;
  }
  return true;
}

function setRunsIsSelected(runs: TeacherRun[], isSelected: boolean[]): void {
  runs.forEach((run: TeacherRun, index: number) => {
    run.isSelected = isSelected[index];
  });
}

function expectRunsIsArchived(runs: TeacherRun[], isArchived: boolean[]): void {
  runs.forEach((run: TeacherRun, index: number) => {
    expect(run.isArchived).toEqual(isArchived[index]);
  });
}

function archiveSelectedRuns(): void {
  describe('archiveSelectedRuns()', () => {
    it('should archive selected runs', () => {
      setRunsIsSelected([run1, run2, run3], [true, true, false]);
      spyOn(teacherService, 'archiveRuns').and.returnValue(of([run1, run2]));
      component.archiveSelectedRuns();
      expectRunsIsSelected([run1, run2, run3], [false, false, false]);
      expectRunsIsArchived([run1, run2, run3], [true, true, false]);
    });
  });
}

function unarchiveSelectedRuns(): void {
  describe('unarchiveSelectedRuns()', () => {
    it('should unarchive selected runs', () => {
      setRunsIsSelected([run1, run2, run3], [true, true, false]);
      spyOn(teacherService, 'unarchiveRuns').and.returnValue(of([run1, run2]));
      component.unarchiveSelectedRuns();
      expectRunsIsSelected([run1, run2, run3], [false, false, false]);
      expectRunsIsArchived([run1, run2, run3], [false, false, false]);
    });
  });
}

function isShowArchiveChanged(): void {
  describe('isShowArchiveChanged()', () => {
    describe('active runs are shown and some runs are selected', () => {
      it('should unselect the runs', () => {
        setRunsIsSelected([run1, run2, run3], [true, false, true]);
        component.isShowArchivedChanged();
        expectRunsIsSelected([run1, run2, run3], [false, false, false]);
      });
    });
  });
}

function runSelectedStatusChanged(): void {
  describe('runSelectedStatusChanged()', () => {
    describe('one run is selected', () => {
      it('should show 1 run selected and indeterminate for the select all checkbox', () => {
        setRunsIsSelected([run1, run2, run3], [true, false, false]);
        component.runSelectedStatusChanged();
        expect(component.numSelectedRuns).toEqual(1);
      });
    });
    describe('two runs are selected', () => {
      it('should show 2 runs selected and indeterminate for the select all checkbox', () => {
        setRunsIsSelected([run1, run2, run3], [true, true, false]);
        component.runSelectedStatusChanged();
        expect(component.numSelectedRuns).toEqual(2);
      });
    });
    describe('all runs are selected', () => {
      it('should show 3 runs selected and checked for the select all checkbox', () => {
        setRunsIsSelected([run1, run2, run3], [true, true, true]);
        component.runSelectedStatusChanged();
        expect(component.numSelectedRuns).toEqual(3);
      });
    });
  });
}

function selectRunsOptionChosen(): void {
  describe('selectRunsOptionChosen()', () => {
    it('when all is chosen, it should select all runs', () => {
      component.selectRunsOptionChosen('all');
      expectRunsIsSelected(component.filteredRuns, [true, true, true]);
    });
    it('when none is chosen, it should select no runs', () => {
      component.selectRunsOptionChosen('none');
      expectRunsIsSelected(component.filteredRuns, [false, false, false]);
    });
    it('when running is chosen, it should select running runs', () => {
      setRunIsCompleted(run2);
      component.selectRunsOptionChosen('running');
      expectRunsIsSelected(component.filteredRuns, [true, false, true]);
    });
    it('when completed is chosen, it should select completed runs', () => {
      setRunIsCompleted(run2);
      component.selectRunsOptionChosen('completed');
      expectRunsIsSelected(component.filteredRuns, [false, true, false]);
    });
  });
}

function setRunIsCompleted(run: TeacherRun): void {
  run.endTime = currentTime - 1000;
}

function expectRunsIsSelected(runs: TeacherRun[], expectRunsIsSelected: boolean[]): void {
  runs.forEach((run: TeacherRun, index: number) => {
    expect(run.isSelected).toEqual(expectRunsIsSelected[index]);
  });
}

function runArchiveStatusChanged(): void {
  describe('runArchiveStatusChanged()', () => {
    it('when a run is archived, it should no longer be displayed in the active view', () => {
      expect(!component.isShowArchived);
      expect(component.filteredRuns.length).toEqual(3);
      setRunIsArchived(run1, true);
      component.runArchiveStatusChanged();
      expect(!component.isShowArchived);
      expect(component.filteredRuns.length).toEqual(2);
    });
  });
}

function setRunIsArchived(run: TeacherRun, isArchived: boolean): void {
  run.isArchived = isArchived;
}
