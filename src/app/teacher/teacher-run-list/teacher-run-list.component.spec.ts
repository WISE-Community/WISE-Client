import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { TeacherRunListComponent } from './teacher-run-list.component';
import { TeacherService } from '../teacher.service';
import { TeacherRun } from '../teacher-run';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../services/user.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../domain/user';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectRunsControlsModule } from '../select-runs-controls/select-runs-controls.module';
import { BrowserModule } from '@angular/platform-browser';
import { TeacherRunListItemComponent } from '../teacher-run-list-item/teacher-run-list-item.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TeacherRunListHarness } from './teacher-run-list.harness';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RunMenuComponent } from '../run-menu/run-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { ArchiveProjectService } from '../../services/archive-project.service';
import { Project } from '../../domain/project';

class TeacherScheduleStubComponent {}

let archiveProjectService: ArchiveProjectService;
let component: TeacherRunListComponent;
let configService: ConfigService;
const currentTime = new Date().getTime();
let fixture: ComponentFixture<TeacherRunListComponent>;
let run1: TeacherRun;
let run2: TeacherRun;
let run3: TeacherRun;
let runListHarness: TeacherRunListHarness;
let teacherService: TeacherService;
let userService: UserService;

function createRun(id: number, ownerId: number, startTime: number): TeacherRun {
  return new TeacherRun({
    id: id,
    isArchived: false,
    isSelected: false,
    numStudents: 10,
    owner: new User({ id: ownerId }),
    periods: [],
    project: {
      id: id,
      tags: [],
      owner: new User({ id: ownerId })
    },
    startTime: startTime
  });
}

describe('TeacherRunListComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RunMenuComponent, TeacherRunListComponent, TeacherRunListItemComponent],
        imports: [
          BrowserAnimationsModule,
          BrowserModule,
          FormsModule,
          HttpClientTestingModule,
          MatCheckboxModule,
          MatDialogModule,
          MatFormFieldModule,
          MatInputModule,
          MatMenuModule,
          MatSlideToggleModule,
          MatSnackBarModule,
          RouterTestingModule.withRoutes([
            { path: 'teacher/home/schedule', component: TeacherScheduleStubComponent }
          ]),
          SelectRunsControlsModule
        ],
        providers: [ArchiveProjectService, ConfigService, TeacherService, UserService],
        schemas: [NO_ERRORS_SCHEMA]
      });
    })
  );

  beforeEach(async () => {
    archiveProjectService = TestBed.inject(ArchiveProjectService);
    configService = TestBed.inject(ConfigService);
    teacherService = TestBed.inject(TeacherService);
    userService = TestBed.inject(UserService);
    spyOn(teacherService, 'getRuns').and.returnValue(
      of([
        createRun(1, 1, new Date('2020-01-01').getTime()),
        createRun(2, 1, new Date('2020-01-02').getTime()),
        createRun(3, 1, new Date('2020-01-03').getTime())
      ])
    );
    spyOn(configService, 'getCurrentServerTime').and.returnValue(currentTime);
    spyOn(configService, 'getContextPath').and.returnValue('');
    spyOn(userService, 'getUserId').and.returnValue(1);
    spyOn(archiveProjectService, 'archiveProject').and.callFake((project: Project) => {
      project.archived = true;
      return of(project);
    });
    spyOn(archiveProjectService, 'archiveProjects').and.callFake((projects: Project[]) => {
      projects.forEach((project) => (project.archived = true));
      return of(projects);
    });
    spyOn(archiveProjectService, 'unarchiveProject').and.callFake((project: Project) => {
      project.archived = false;
      return of(project);
    });
    spyOn(archiveProjectService, 'unarchiveProjects').and.callFake((projects: Project[]) => {
      projects.forEach((project) => (project.archived = false));
      return of(projects);
    });
    fixture = TestBed.createComponent(TeacherRunListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    run1 = component.runs[0];
    run2 = component.runs[1];
    run3 = component.runs[2];
    runListHarness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      TeacherRunListHarness
    );
  });

  archiveSelectedRuns();
  isShowArchiveChanged();
  runArchiveStatusChanged();
  runSelectedStatusChanged();
  selectAllRunsCheckboxClicked();
  selectRunsOptionChosen();
  sortByStartTimeDesc();
  unarchiveSelectedRuns();
});

function sortByStartTimeDesc() {
  describe('sortByStartTimeDesc()', () => {
    it('should sort runs by start date', () => {
      expect(isRunsSortedByStartTimeDesc(component.filteredRuns)).toBeTruthy();
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

function archiveSelectedRuns(): void {
  describe('archiveSelectedRuns()', () => {
    it('should archive selected runs', async () => {
      await runListHarness.clickRunListItemCheckbox(0);
      await runListHarness.clickRunListItemCheckbox(1);
      await runListHarness.clickArchiveButton();
      expectRunsIsSelected([run1, run2, run3], [false, false, false]);
      expectRunsIsArchived([run1, run2, run3], [false, true, true]);
    });
  });
}

function unarchiveSelectedRuns(): void {
  describe('unarchiveSelectedRuns()', () => {
    it('should unarchive selected runs', async () => {
      run1.isArchived = true;
      run2.isArchived = true;
      await runListHarness.toggleArchiveToggle();
      await runListHarness.clickRunListItemCheckbox(0);
      await runListHarness.clickRunListItemCheckbox(1);
      await runListHarness.clickUnarchiveButton();
      expectRunsIsSelected([run1, run2, run3], [false, false, false]);
      expectRunsIsArchived([run1, run2, run3], [false, false, false]);
    });
  });
}

function isShowArchiveChanged(): void {
  describe('isShowArchiveChanged()', () => {
    describe('active runs are shown and some runs are selected', () => {
      it('should unselect the runs', async () => {
        expect(await runListHarness.isShowingArchived()).toBeFalse();
        await runListHarness.clickRunListItemCheckbox(0);
        await runListHarness.clickRunListItemCheckbox(2);
        await runListHarness.toggleArchiveToggle();
        expect(await runListHarness.isShowingArchived()).toBeTrue();
        expectRunsIsSelected([run1, run2, run3], [false, false, false]);
      });
    });
  });
}

function runSelectedStatusChanged(): void {
  describe('runSelectedStatusChanged()', () => {
    describe('one run is selected', () => {
      it('should show 1 run selected and indeterminate for the select all checkbox', async () => {
        await runListHarness.clickRunListItemCheckbox(0);
        expect(await runListHarness.isSelectRunsCheckboxIndeterminate()).toBeTrue();
        expect(component.numSelectedRuns).toEqual(1);
      });
    });
    describe('two runs are selected', () => {
      it('should show 2 runs selected and indeterminate for the select all checkbox', async () => {
        await runListHarness.clickRunListItemCheckbox(0);
        await runListHarness.clickRunListItemCheckbox(1);
        expect(await runListHarness.isSelectRunsCheckboxIndeterminate()).toBeTrue();
        expect(component.numSelectedRuns).toEqual(2);
      });
    });
    describe('all runs are selected', () => {
      it('should show 3 runs selected and checked for the select all checkbox', async () => {
        await runListHarness.clickRunListItemCheckbox(0);
        await runListHarness.clickRunListItemCheckbox(1);
        await runListHarness.clickRunListItemCheckbox(2);
        expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeTrue();
        expect(component.numSelectedRuns).toEqual(3);
      });
    });
  });
}

function selectAllRunsCheckboxClicked(): void {
  describe('selectAllRunsCheckboxClicked()', () => {
    describe('select all runs checkbox is not checked', () => {
      it('when select all runs checkbox is checked it should select all runs', async () => {
        expectRunsIsSelected([run1, run2, run3], [false, false, false]);
        expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeFalse();
        await runListHarness.checkSelectRunsCheckbox();
        expectRunsIsSelected([run1, run2, run3], [true, true, true]);
        expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeTrue();
      });
    });
    describe('select all runs checkbox is checked', () => {
      it('when select all runs checkbox is clicked it should unselect all runs', async () => {
        await runListHarness.checkSelectRunsCheckbox();
        expectRunsIsSelected([run1, run2, run3], [true, true, true]);
        expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeTrue();
        await runListHarness.uncheckSelectRunsCheckbox();
        expectRunsIsSelected([run1, run2, run3], [false, false, false]);
        expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeFalse();
      });
    });
    describe('select all runs checkbox is indeterminate checked', () => {
      it('when select all runs checkbox is unchecked it should unselect all runs', async () => {
        await runListHarness.clickRunListItemCheckbox(0);
        expectRunsIsSelected([run1, run2, run3], [false, false, true]);
        expect(await runListHarness.isSelectRunsCheckboxIndeterminate()).toBeTrue();
        await runListHarness.toggleSelectRunsCheckbox();
        expectRunsIsSelected([run1, run2, run3], [false, false, false]);
        expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeFalse();
      });
    });
  });
}

function selectRunsOptionChosen(): void {
  describe('selectRunsOptionChosen()', () => {
    it('when all is chosen, it should select all runs2', async () => {
      await runListHarness.clickSelectRunsMenuButton('All');
      expectRunsIsSelected(component.filteredRuns, [true, true, true]);
    });
    it('when none is chosen, it should select no runs', async () => {
      await runListHarness.clickSelectRunsMenuButton('None');
      expectRunsIsSelected(component.filteredRuns, [false, false, false]);
    });
    it('when running is chosen, it should select running runs', async () => {
      setRunIsCompleted(run2);
      await runListHarness.clickSelectRunsMenuButton('Running');
      expectRunsIsSelected(component.filteredRuns, [true, false, true]);
    });
    it('when completed is chosen, it should select completed runs', async () => {
      setRunIsCompleted(run2);
      await runListHarness.clickSelectRunsMenuButton('Completed');
      expectRunsIsSelected(component.filteredRuns, [false, true, false]);
    });
  });
}

function setRunIsCompleted(run: TeacherRun): void {
  run.endTime = currentTime - 1000;
}

function runArchiveStatusChanged(): void {
  describe('runArchiveStatusChanged()', () => {
    it('when a run is archived, it should no longer be displayed in the active view', async () => {
      expect(!component.isShowArchived);
      expect(component.filteredRuns.length).toEqual(3);
      expect(await runListHarness.getNumRunListItems()).toEqual(3);
      await runListHarness.clickRunListItemMenuButton(1, 'folderArchive');
      expect(!component.isShowArchived);
      expect(component.filteredRuns.length).toEqual(2);
      expect(await runListHarness.getNumRunListItems()).toEqual(2);
    });
  });
}

function expectRunsIsSelected(runs: TeacherRun[], expectRunsIsSelected: boolean[]): void {
  runs.forEach((run: TeacherRun, index: number) => {
    expect(run.isSelected).toEqual(expectRunsIsSelected[index]);
  });
}

function expectRunsIsArchived(runs: TeacherRun[], isArchived: boolean[]): void {
  runs.forEach((run: TeacherRun, index: number) => {
    expect(run.isArchived).toEqual(isArchived[index]);
  });
}
