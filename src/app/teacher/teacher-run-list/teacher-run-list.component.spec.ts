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
import { MatCardModule } from '@angular/material/card';
import { MockArchiveProjectService } from '../../services/mock-archive-project.service';

class TeacherScheduleStubComponent {}

let component: TeacherRunListComponent;
let configService: ConfigService;
const currentTime = new Date().getTime();
let fixture: ComponentFixture<TeacherRunListComponent>;
let getRunsSpy: jasmine.Spy;
let runListHarness: TeacherRunListHarness;
const run1StartTime = new Date('2020-01-01').getTime();
const run2StartTime = new Date('2020-01-02').getTime();
const run3StartTime = new Date('2020-01-03').getTime();
const run1Title = 'First Run';
const run2Title = 'Second Run';
const run3Title = 'Third Run';
let teacherService: TeacherService;
const userId: number = 1;
let userService: UserService;

function createRun(
  id: number,
  startTime: number,
  endTime: number,
  name: string,
  tags: string[] = []
): TeacherRun {
  return new TeacherRun({
    id: id,
    archived: false,
    selected: false,
    name: name,
    numStudents: 10,
    owner: new User({ id: userId }),
    periods: [],
    project: {
      id: id,
      tags: tags,
      name: name,
      owner: new User({ id: userId })
    },
    startTime: startTime,
    endTime: endTime
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
          MatCardModule,
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
        providers: [
          { provide: ArchiveProjectService, useClass: MockArchiveProjectService },
          ConfigService,
          TeacherService,
          UserService
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
    })
  );

  beforeEach(async () => {
    configService = TestBed.inject(ConfigService);
    teacherService = TestBed.inject(TeacherService);
    userService = TestBed.inject(UserService);
    getRunsSpy = spyOn(teacherService, 'getRuns');
    getRunsSpy.and.returnValue(
      of([
        createRun(1, run1StartTime, null, run1Title),
        createRun(2, run2StartTime, null, run2Title),
        createRun(3, run3StartTime, null, run3Title)
      ])
    );
    spyOn(configService, 'getCurrentServerTime').and.returnValue(currentTime);
    spyOn(configService, 'getContextPath').and.returnValue('');
    spyOn(userService, 'getUserId').and.returnValue(userId);
    fixture = TestBed.createComponent(TeacherRunListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    it('should sort runs by start date', async () => {
      await expectRunTitles([run3Title, run2Title, run1Title]);
    });
  });
}

function archiveSelectedRuns(): void {
  describe('archiveSelectedRuns()', () => {
    it('should archive selected runs', async () => {
      await runListHarness.clickRunListItemCheckbox(0);
      await runListHarness.clickRunListItemCheckbox(1);
      await runListHarness.clickArchiveButton();
      expect(await runListHarness.getNumRunListItems()).toEqual(1);
      await expectRunTitles([run1Title]);
    });
  });
}

function unarchiveSelectedRuns(): void {
  describe('unarchiveSelectedRuns()', () => {
    it('should unarchive selected runs', async () => {
      getRunsSpy.and.returnValue(
        of([
          createRun(1, run1StartTime, null, run1Title),
          createRun(2, run2StartTime, null, run2Title, ['archived']),
          createRun(3, run3StartTime, null, run3Title, ['archived'])
        ])
      );
      component.ngOnInit();
      await runListHarness.toggleArchiveToggle();
      expect(await runListHarness.getNumRunListItems()).toEqual(2);
      await runListHarness.clickRunListItemCheckbox(0);
      await runListHarness.clickRunListItemCheckbox(1);
      await runListHarness.clickUnarchiveButton();
      expect(await runListHarness.getNumRunListItems()).toEqual(0);
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
        await expectRunsIsSelected([false, false, false]);
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
        expect(await runListHarness.getNumSelectedRunListItems()).toEqual(1);
      });
    });
    describe('two runs are selected', () => {
      it('should show 2 runs selected and indeterminate for the select all checkbox', async () => {
        await runListHarness.clickRunListItemCheckbox(0);
        await runListHarness.clickRunListItemCheckbox(1);
        expect(await runListHarness.isSelectRunsCheckboxIndeterminate()).toBeTrue();
        expect(await runListHarness.getNumSelectedRunListItems()).toEqual(2);
      });
    });
    describe('all runs are selected', () => {
      it('should show 3 runs selected and checked for the select all checkbox', async () => {
        await runListHarness.clickRunListItemCheckbox(0);
        await runListHarness.clickRunListItemCheckbox(1);
        await runListHarness.clickRunListItemCheckbox(2);
        expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeTrue();
        expect(await runListHarness.getNumSelectedRunListItems()).toEqual(3);
      });
    });
  });
}

function selectAllRunsCheckboxClicked(): void {
  describe('selectAllRunsCheckboxClicked()', () => {
    describe('select all runs checkbox is not checked', () => {
      it('when select all runs checkbox is checked it should select all runs', async () => {
        await expectRunsIsSelected([false, false, false]);
        expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeFalse();
        await runListHarness.checkSelectRunsCheckbox();
        await expectRunsIsSelected([true, true, true]);
        expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeTrue();
      });
    });
    describe('select all runs checkbox is checked', () => {
      it('when select all runs checkbox is clicked it should unselect all runs', async () => {
        await runListHarness.checkSelectRunsCheckbox();
        await expectRunsIsSelected([true, true, true]);
        expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeTrue();
        await runListHarness.uncheckSelectRunsCheckbox();
        await expectRunsIsSelected([false, false, false]);
        expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeFalse();
      });
    });
    describe('select all runs checkbox is indeterminate checked', () => {
      it('when select all runs checkbox is unchecked it should unselect all runs', async () => {
        await runListHarness.clickRunListItemCheckbox(0);
        await expectRunsIsSelected([true, false, false]);
        expect(await runListHarness.isSelectRunsCheckboxIndeterminate()).toBeTrue();
        await runListHarness.toggleSelectRunsCheckbox();
        await expectRunsIsSelected([false, false, false]);
        expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeFalse();
      });
    });
  });
}

function selectRunsOptionChosen(): void {
  describe('selectRunsOptionChosen()', () => {
    it('when all is chosen, it should select all runs2', async () => {
      await runListHarness.clickSelectRunsMenuButton('All');
      await expectRunsIsSelected([true, true, true]);
    });
    it('when none is chosen, it should select no runs', async () => {
      await runListHarness.clickSelectRunsMenuButton('None');
      await expectRunsIsSelected([false, false, false]);
    });
    it('when running is chosen, it should select running runs', async () => {
      setRun2Completed();
      await runListHarness.clickSelectRunsMenuButton('Running');
      await expectRunsIsSelected([true, false, true]);
    });
    it('when completed is chosen, it should select completed runs', async () => {
      setRun2Completed();
      await runListHarness.clickSelectRunsMenuButton('Completed');
      await expectRunsIsSelected([false, true, false]);
    });
  });
}

function setRun2Completed(): void {
  getRunsSpy.and.returnValue(
    of([
      createRun(1, run1StartTime, null, run1Title),
      createRun(2, run2StartTime, currentTime - 1000, run2Title),
      createRun(3, run3StartTime, null, run3Title)
    ])
  );
  component.ngOnInit();
}

function runArchiveStatusChanged(): void {
  describe('runArchiveStatusChanged()', () => {
    it('when a run is archived, it should no longer be displayed in the active view', async () => {
      expect(await runListHarness.isShowingArchived()).toBeFalse();
      expect(await runListHarness.getNumRunListItems()).toEqual(3);
      await runListHarness.clickRunListItemMenuArchiveButton(1);
      expect(await runListHarness.isShowingArchived()).toBeFalse();
      expect(await runListHarness.getNumRunListItems()).toEqual(2);
      await expectRunTitles([run3Title, run1Title]);
    });
    it('when a run is unarchived, it should no longer be displayed in the archived view', async () => {
      getRunsSpy.and.returnValue(
        of([
          createRun(1, run1StartTime, null, run1Title),
          createRun(2, run2StartTime, null, run2Title, ['archived']),
          createRun(3, run3StartTime, null, run3Title)
        ])
      );
      component.ngOnInit();
      await runListHarness.toggleArchiveToggle();
      expect(await runListHarness.isShowingArchived()).toBeTrue();
      expect(await runListHarness.getNumRunListItems()).toEqual(1);
      await expectRunTitles([run2Title]);
      await runListHarness.clickRunListItemMenuUnarchiveButton(0);
      expect(await runListHarness.isShowingArchived()).toBeTrue();
      expect(await runListHarness.getNumRunListItems()).toEqual(0);
    });
  });
}

async function expectRunTitles(expectedRunTitles: string[]): Promise<void> {
  const numRunListItems = await runListHarness.getNumRunListItems();
  for (let i = 0; i < numRunListItems; i++) {
    const runListItem = await runListHarness.getRunListItem(i);
    expect(await runListItem.getRunTitle()).toEqual(expectedRunTitles[i]);
  }
}

async function expectRunsIsSelected(expectRunsIsSelected: boolean[]): Promise<void> {
  const numRunListItems = await runListHarness.getNumRunListItems();
  for (let i = 0; i < numRunListItems; i++) {
    expect(await runListHarness.isRunListItemCheckboxChecked(i)).toEqual(expectRunsIsSelected[i]);
  }
}
