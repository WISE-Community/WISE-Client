import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RunMenuComponent } from './run-menu.component';
import { TeacherService } from '../teacher.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { ConfigService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { User } from '../../domain/user';
import { TeacherRun } from '../teacher-run';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Course } from '../../domain/course';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ArchiveProjectService } from '../../services/archive-project.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RunMenuHarness } from './run-menu.harness';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MockArchiveProjectService } from '../../services/mock-archive-project.service';

export class MockTeacherService {
  checkClassroomAuthorization(): Observable<string> {
    return Observable.create('');
  }
  getClassroomCourses(): Observable<Course[]> {
    const courses: Course[] = [];
    const course = new Course({ id: '1', name: 'Test' });
    courses.push(course);
    return Observable.create((observer) => {
      observer.next(courses);
      observer.complete();
    });
  }
}

export class MockUserService {
  getUser(): BehaviorSubject<User> {
    const user: User = new User();
    user.firstName = 'Demo';
    user.lastName = 'Teacher';
    user.role = 'teacher';
    user.username = 'DemoTeacher';
    user.id = 123456;
    user.isGoogleUser = false;
    return Observable.create((observer) => {
      observer.next(user);
      observer.complete();
    });
  }
  getUserId() {
    return 123456;
  }
  isGoogleUser() {
    return false;
  }
}

export class MockConfigService {
  getContextPath(): string {
    return '/wise';
  }
}

let archiveProjectService: ArchiveProjectService;
let component: RunMenuComponent;
let fixture: ComponentFixture<RunMenuComponent>;
const owner = new User();
let runMenuHarness: RunMenuHarness;
let snackBarSpy: jasmine.Spy;
let teacherService: TeacherService;

describe('RunMenuComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          BrowserAnimationsModule,
          HttpClientTestingModule,
          MatButtonModule,
          MatIconModule,
          MatMenuModule,
          MatSnackBarModule,
          RouterTestingModule
        ],
        declarations: [RunMenuComponent],
        providers: [
          { provide: ArchiveProjectService, useClass: MockArchiveProjectService },
          { provide: TeacherService, useClass: MockTeacherService },
          { provide: UserService, useClass: MockUserService },
          { provide: ConfigService, useClass: MockConfigService },
          { provide: MatDialog, useValue: {} }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(async () => {
    fixture = TestBed.createComponent(RunMenuComponent);
    component = fixture.componentInstance;
    setRun(false);
    archiveProjectService = TestBed.inject(ArchiveProjectService);
    teacherService = TestBed.inject(TeacherService);
    snackBarSpy = spyOn(TestBed.inject(MatSnackBar), 'open');
    fixture.detectChanges();
    runMenuHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, RunMenuHarness);
  });

  archive();
  unarchive();
});

function setRun(archived: boolean): void {
  component.run = new TeacherRun({
    id: 1,
    name: 'Photosynthesis',
    owner: owner,
    project: {
      id: 1,
      owner: owner,
      sharedOwners: []
    },
    archived: archived
  });
}

function archive() {
  describe('archive()', () => {
    it('should archive a run', async () => {
      await runMenuHarness.clickArchiveMenuButton();
      expect(component.run.archived).toEqual(true);
      expect(snackBarSpy).toHaveBeenCalledWith('Successfully Archived Unit');
    });
  });
}

function unarchive() {
  describe('unarchive()', () => {
    it('should unarchive a run', async () => {
      setRun(true);
      component.ngOnInit();
      await runMenuHarness.clickUnarchiveMenuButton();
      expect(component.run.archived).toEqual(false);
      expect(snackBarSpy).toHaveBeenCalledWith('Successfully Unarchived Unit');
    });
  });
}
