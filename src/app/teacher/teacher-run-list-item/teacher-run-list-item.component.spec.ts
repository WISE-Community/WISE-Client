import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherRunListItemComponent } from './teacher-run-list-item.component';
import { TeacherService } from '../teacher.service';
import { TeacherRun } from '../teacher-run';
import { ConfigService } from '../../services/config.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TeacherRunListItemHarness } from './teacher-run-list-item.harness';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuModule } from '@angular/material/menu';
import { RunMenuComponent } from '../run-menu/run-menu.component';
import { ArchiveProjectService } from '../../services/archive-project.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '../../services/user.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../domain/user';
import { MockArchiveProjectService } from '../../services/mock-archive-project.service';

export class MockTeacherService {}

export class MockConfigService {
  getContextPath(): string {
    return '/wise';
  }
  getCurrentServerTime(): number {
    return new Date('2018-08-24T00:00:00.0').getTime();
  }
  getWISE4Hostname(): string {
    return 'http://localhost:8080/legacy';
  }
}

let component: TeacherRunListItemComponent;
let fixture: ComponentFixture<TeacherRunListItemComponent>;
const periods = ['1', '2'];
const projectName: string = 'Photosynthesis';
const numStudents: number = 30;
const runCode: string = 'Dog123';
let runListItemHarness: TeacherRunListItemHarness;
const userId: number = 1;
let userService: UserService;

describe('TeacherRunListItemComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [RunMenuComponent, TeacherRunListItemComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatMenuModule,
        MatSnackBarModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ArchiveProjectService, useClass: MockArchiveProjectService },
        { provide: ConfigService, useClass: MockConfigService },
        { provide: TeacherService, useClass: MockTeacherService },
        UserService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    userService = TestBed.inject(UserService);
    spyOn(userService, 'getUserId').and.returnValue(userId);
    fixture = TestBed.createComponent(TeacherRunListItemComponent);
    component = fixture.componentInstance;
    component.run = new TeacherRun({
      id: 1,
      archived: false,
      selected: false,
      name: projectName,
      numStudents: numStudents,
      owner: new User({ id: userId }),
      periods: periods,
      project: {
        id: 1,
        tags: [],
        name: projectName,
        owner: new User({ id: userId })
      },
      runCode: runCode,
      startTime: new Date('2018-10-17').getTime(),
      endTime: new Date('2018-10-18').getTime()
    });
    fixture.detectChanges();
    runListItemHarness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      TeacherRunListItemHarness
    );
  });

  render();
  runArchiveStatusChanged();
});

function render() {
  describe('render', () => {
    it('should show run info', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.textContent).toContain(projectName);
      expect(compiled.textContent).toContain(`${periods.length} periods`);
      expect(compiled.textContent).toContain(`${numStudents} students`);
      expect(compiled.textContent).toContain(`Access Code: ${runCode}`);
    });
  });
}

function runArchiveStatusChanged() {
  describe('run is not archived and archive menu button is clicked', () => {
    it('should archive run and emit events', async () => {
      const runSelectedSpy = spyOn(component.runSelectedStatusChangedEvent, 'emit');
      const runArchiveSpy = spyOn(component.runArchiveStatusChangedEvent, 'emit');
      expect(await runListItemHarness.isArchived()).toBeFalse();
      await runListItemHarness.clickArchiveMenuButton();
      expect(await runListItemHarness.isArchived()).toBeTrue();
      expect(runSelectedSpy).toHaveBeenCalled();
      expect(runArchiveSpy).toHaveBeenCalled();
    });
  });
}
