import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RunMenuComponent } from './run-menu.component';
import { TeacherService } from '../teacher.service';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
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
  archiveRun(run: TeacherRun) {
    return of({});
  }
  unarchiveRun(run: TeacherRun) {
    return of({});
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

let component: RunMenuComponent;
let fixture: ComponentFixture<RunMenuComponent>;
let snackBarSpy: jasmine.Spy;
let teacherService: TeacherService;

describe('RunMenuComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [BrowserAnimationsModule, MatMenuModule, MatSnackBarModule, RouterTestingModule],
        declarations: [RunMenuComponent],
        providers: [
          { provide: TeacherService, useClass: MockTeacherService },
          { provide: UserService, useClass: MockUserService },
          { provide: ConfigService, useClass: MockConfigService },
          { provide: MatDialog, useValue: {} }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RunMenuComponent);
    component = fixture.componentInstance;
    const owner = new User();
    component.run = new TeacherRun({
      id: 1,
      name: 'Photosynthesis',
      owner: owner,
      project: {
        id: 1,
        owner: owner,
        sharedOwners: []
      }
    });
    teacherService = TestBed.inject(TeacherService);
    snackBarSpy = spyOn(TestBed.inject(MatSnackBar), 'open');
    fixture.detectChanges();
  });

  archive();
  unarchive();
});

function archive() {
  describe('archive()', () => {
    it('should archive a run', () => {
      component.archive();
      expect(component.run.project.isDeleted).toEqual(true);
      expect(snackBarSpy).toHaveBeenCalledWith('Successfully Archived Run');
    });
  });
}

function unarchive() {
  describe('unarchive()', () => {
    it('should unarchive a run', () => {
      component.unarchive();
      expect(component.run.project.isDeleted).toEqual(false);
      expect(snackBarSpy).toHaveBeenCalledWith('Successfully Unarchived Run');
    });
  });
}
