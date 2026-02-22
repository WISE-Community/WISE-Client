import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../domain/user';
import { UserService } from '../../services/user.service';
import { StudentHomeComponent } from './student-home.component';
import { MockComponent } from 'ng-mocks';
import { StudentRunListComponent } from '../student-run-list/student-run-list.component';

export class MockUserService {
  getUser(): Observable<User[]> {
    const user: User = new User();
    user.firstName = 'Demo';
    user.lastName = 'User';
    user.roles = ['student'];
    user.username = 'DemoUser0101';
    user.id = 123456;
    return new Observable((observer) => {
      observer.next([user]);
      observer.complete();
    });
  }
}

describe('StudentHomeComponent', () => {
  let component: StudentHomeComponent;
  let fixture: ComponentFixture<StudentHomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: MatDialog, useValue: {} }
      ],
      imports: [StudentHomeComponent, MockComponent(StudentRunListComponent)]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
