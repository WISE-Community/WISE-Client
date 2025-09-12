import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ListClassroomCoursesDialogComponent } from './list-classroom-courses-dialog.component';
import { TeacherService } from '../teacher.service';
import { UserService } from '../../services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../domain/user';
import { Observable } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

export class MockTeacherService {
  addToClassroom: (accessCode: string, unitTitle: number, courseId: number) => {};
}

export class MockUserService {
  getUser(): Observable<User> {
    const user: User = new User();
    user.username = 'test';
    return new Observable((observer) => {
      observer.next(user);
      observer.complete();
    });
  }
}

describe('ListClassroomCoursesDialogComponent', () => {
  let component: ListClassroomCoursesDialogComponent;
  let fixture: ComponentFixture<ListClassroomCoursesDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ListClassroomCoursesDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            run: {
              id: 1,
              name: 'Test',
              accessCode: 'Test123'
            },
            courses: [{ id: '1', name: 'Test' }]
          }
        },
        { provide: TeacherService, useClass: MockTeacherService },
        { provide: UserService, useClass: MockUserService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClassroomCoursesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
