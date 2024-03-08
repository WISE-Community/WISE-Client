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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RunMenuComponent } from '../run-menu/run-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { ArchiveProjectService } from '../../services/archive-project.service';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { ArchiveProjectsButtonComponent } from '../archive-projects-button/archive-projects-button.component';
import { Project } from '../../domain/project';
import { SearchBarComponent } from '../../modules/shared/search-bar/search-bar.component';
import { HttpClient } from '@angular/common/http';
import { ArchiveProjectResponse } from '../../domain/archiveProjectResponse';

class TeacherScheduleStubComponent {}

let component: TeacherRunListComponent;
let configService: ConfigService;
const currentTime = new Date().getTime();
let fixture: ComponentFixture<TeacherRunListComponent>;
let getRunsSpy: jasmine.Spy;
let http: HttpClient;
const run1StartTime = new Date('2020-01-01').getTime();
const run1Title = 'First Run';
const run2StartTime = new Date('2020-01-02').getTime();
const run2Title = 'Second Run';
const run3StartTime = new Date('2020-01-03').getTime();
const run3Title = 'Third Run';
let runListHarness: TeacherRunListHarness;
let teacherService: TeacherService;
const userId: number = 1;
let userService: UserService;

class TeacherRunStub extends TeacherRun {
  constructor(id: number, startTime: number, endTime: number, name: string, tags: string[] = []) {
    super({
      id: id,
      archived: false,
      selected: false,
      name: name,
      numStudents: 10,
      owner: new User({ id: userId }),
      periods: [],
      project: new Project({
        archived: tags.includes('archived'),
        id: id,
        tags: tags,
        name: name,
        owner: new User({ id: userId })
      }),
      startTime: startTime,
      endTime: endTime
    });
  }
}

describe('TeacherRunListComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          RunMenuComponent,
          SearchBarComponent,
          TeacherRunListComponent,
          TeacherRunListItemComponent
        ],
        imports: [
          ArchiveProjectsButtonComponent,
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
          MatSelectModule,
          MatSnackBarModule,
          ReactiveFormsModule,
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
    configService = TestBed.inject(ConfigService);
    http = TestBed.inject(HttpClient);
    teacherService = TestBed.inject(TeacherService);
    userService = TestBed.inject(UserService);
    getRunsSpy = spyOn(teacherService, 'getRuns');
    getRunsSpy.and.returnValue(
      of([
        new TeacherRunStub(1, run1StartTime, currentTime - 1000, run1Title),
        new TeacherRunStub(2, run2StartTime, null, run2Title),
        new TeacherRunStub(3, currentTime + 86400000, null, run3Title)
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
  showArchivedChanged();
  runArchiveStatusChanged();
  runSelectedStatusChanged();
  selectAllRunsCheckboxClicked();
  selectRunsOptionChosen();
  unarchiveSelectedRuns();
  noRuns();
  searchUnselectAllRuns();
});

function archiveSelectedRuns(): void {
  describe('archiveSelectedRuns()', () => {
    it('should archive selected runs', async () => {
      await runListHarness.clickRunListItemCheckbox(0);
      await runListHarness.clickRunListItemCheckbox(1);
      spyOn(http, 'put').and.returnValue(
        of([new ArchiveProjectResponse(3, true), new ArchiveProjectResponse(2, true)])
      );
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
          new TeacherRunStub(1, run1StartTime, null, run1Title),
          new TeacherRunStub(2, run2StartTime, null, run2Title, ['archived']),
          new TeacherRunStub(3, run3StartTime, null, run3Title, ['archived'])
        ])
      );
      component.ngOnInit();
      await runListHarness.showArchived();
      expect(await runListHarness.getNumRunListItems()).toEqual(2);
      await runListHarness.clickRunListItemCheckbox(0);
      await runListHarness.clickRunListItemCheckbox(1);
      spyOn(http, 'delete').and.returnValue(
        of([new ArchiveProjectResponse(3, false), new ArchiveProjectResponse(2, false)])
      );
      await runListHarness.clickUnarchiveButton();
      expect(await runListHarness.getNumRunListItems()).toEqual(0);
    });
  });
}

function showArchivedChanged(): void {
  describe('showArchivedChanged()', () => {
    describe('active runs are shown and some runs are selected', () => {
      it('should unselect the runs', async () => {
        expect(await runListHarness.isShowingArchived()).toBeFalse();
        await runListHarness.clickRunListItemCheckbox(0);
        await runListHarness.clickRunListItemCheckbox(2);
        await runListHarness.showArchived();
        expect(await runListHarness.isShowingArchived()).toBeTrue();
        await expectRunsIsSelected([false, false, false]);
      });
    });
  });
}

function runSelectedStatusChanged(): void {
  describe('runSelectedStatusChanged()', () => {
    describe('one run is selected', () => {
      it('should show indeterminate for the select all checkbox', async () => {
        await clickRunListeItemCheckboxes([0]);
        expect(await runListHarness.isSelectRunsCheckboxIndeterminate()).toBeTrue();
      });
    });
    describe('two runs are selected', () => {
      it('should show indeterminate for the select all checkbox', async () => {
        await clickRunListeItemCheckboxes([0, 1]);
        expect(await runListHarness.isSelectRunsCheckboxIndeterminate()).toBeTrue();
      });
    });
    describe('all runs are selected', () => {
      it('should show checked for the select all checkbox', async () => {
        await clickRunListeItemCheckboxes([0, 1, 2]);
        expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeTrue();
      });
    });
  });
}

async function clickRunListeItemCheckboxes(indexes: number[]): Promise<void> {
  for (const index of indexes) {
    await runListHarness.clickRunListItemCheckbox(index);
  }
}

function selectAllRunsCheckboxClicked(): void {
  describe('selectAllRunsCheckboxClicked()', () => {
    selectAllRuns();
    unselectAllRuns();
    someSelectedUnselectAllRuns();
  });
}

function selectAllRuns() {
  describe('select all runs checkbox is not checked and it is clicked', () => {
    it('should select all runs', async () => {
      await expectRunsIsSelected([false, false, false]);
      expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeFalse();
      await runListHarness.checkSelectRunsCheckbox();
      await expectRunsIsSelected([true, true, true]);
      expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeTrue();
    });
  });
}

function unselectAllRuns() {
  describe('select all runs checkbox is checked and it is clicked', () => {
    it('should unselect all runs', async () => {
      await runListHarness.checkSelectRunsCheckbox();
      await expectRunsIsSelected([true, true, true]);
      expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeTrue();
      await runListHarness.uncheckSelectRunsCheckbox();
      await expectRunsIsSelected([false, false, false]);
      expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeFalse();
    });
  });
}

function someSelectedUnselectAllRuns() {
  describe('select all runs checkbox is indeterminate checked and it is clicked', () => {
    it('should unselect all runs', async () => {
      await runListHarness.clickRunListItemCheckbox(0);
      await expectRunsIsSelected([true, false, false]);
      expect(await runListHarness.isSelectRunsCheckboxIndeterminate()).toBeTrue();
      await runListHarness.toggleSelectRunsCheckbox();
      await expectRunsIsSelected([false, false, false]);
      expect(await runListHarness.isSelectRunsCheckboxChecked()).toBeFalse();
    });
  });
}

function selectRunsOptionChosen(): void {
  describe('selectRunsOptionChosen()', () => {
    const testCases = [
      { menuButtonText: 'All', selectedRuns: [true, true, true] },
      { menuButtonText: 'None', selectedRuns: [false, false, false] },
      { menuButtonText: 'Completed', selectedRuns: [false, false, true] },
      { menuButtonText: 'Running', selectedRuns: [false, true, false] },
      { menuButtonText: 'Scheduled', selectedRuns: [true, false, false] }
    ];
    testCases.forEach(({ menuButtonText, selectedRuns }) => {
      describe(`when ${menuButtonText} option is chosen`, () => {
        beforeEach(async () => {
          await runListHarness.clickSelectRunsMenuButton(menuButtonText);
        });
        it(`should select ${menuButtonText} runs`, async () => {
          await expectRunsIsSelected(selectedRuns);
        });
      });
    });
  });
}

function runArchiveStatusChanged(): void {
  describe('runArchiveStatusChanged()', () => {
    archiveRunNoLongerInActiveView();
    unarchiveRunNoLongerInArchivedView();
  });
}

function archiveRunNoLongerInActiveView() {
  describe('when a run is archived', () => {
    it('it should no longer be displayed in the active view', async () => {
      expect(await runListHarness.isShowingArchived()).toBeFalse();
      expect(await runListHarness.getNumRunListItems()).toEqual(3);
      spyOn(http, 'put').and.returnValue(of(new ArchiveProjectResponse(2, true)));
      await runListHarness.clickRunListItemMenuArchiveButton(1);
      expect(await runListHarness.isShowingArchived()).toBeFalse();
      expect(await runListHarness.getNumRunListItems()).toEqual(2);
      await expectRunTitles([run3Title, run1Title]);
    });
  });
}

function unarchiveRunNoLongerInArchivedView() {
  describe('when a run is unarchived', () => {
    it('it should no longer be displayed in the archived view', async () => {
      getRunsSpy.and.returnValue(
        of([
          new TeacherRunStub(1, run1StartTime, null, run1Title),
          new TeacherRunStub(2, run2StartTime, null, run2Title, ['archived']),
          new TeacherRunStub(3, run3StartTime, null, run3Title)
        ])
      );
      component.ngOnInit();
      await runListHarness.showArchived();
      expect(await runListHarness.isShowingArchived()).toBeTrue();
      expect(await runListHarness.getNumRunListItems()).toEqual(1);
      await expectRunTitles([run2Title]);
      spyOn(http, 'delete').and.returnValue(of(new ArchiveProjectResponse(2, false)));
      await runListHarness.clickRunListItemMenuUnarchiveButton(0);
      expect(await runListHarness.isShowingArchived()).toBeTrue();
      expect(await runListHarness.getNumRunListItems()).toEqual(0);
    });
  });
}

function noRuns(): void {
  describe('when there are no runs', () => {
    beforeEach(() => {
      getRunsSpy.and.returnValue(of([]));
      component.ngOnInit();
    });
    describe('in the active view', () => {
      it('should display a message', async () => {
        expect(await runListHarness.isShowingArchived()).toBeFalse();
        expect(await runListHarness.getNoRunsMessage()).toContain(
          "Hey there! Looks like you don't have any active classroom units."
        );
      });
    });
    describe('in the archived view', () => {
      it('should display a message', async () => {
        await runListHarness.showArchived();
        expect(await runListHarness.isShowingArchived()).toBeTrue();
        expect(await runListHarness.getNoRunsMessage()).toContain(
          "Looks like you don't have any archived classroom units."
        );
      });
    });
  });
}

function searchUnselectAllRuns(): void {
  describe('runs are selected', () => {
    describe('perform search', () => {
      it('unselects all runs', async () => {
        await runListHarness.clickRunListItemCheckbox(0);
        await runListHarness.clickRunListItemCheckbox(1);
        await runListHarness.clickRunListItemCheckbox(2);
        const searchInput = await runListHarness.getSearchInput();
        await searchInput.sendKeys('first');
        await expectRunsIsSelected([false]);
      });
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
