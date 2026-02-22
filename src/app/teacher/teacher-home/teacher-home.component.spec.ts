import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../domain/user';
import { TeacherHomeComponent } from './teacher-home.component';
import { ConfigService } from '../../services/config.service';
import { Config } from '../../domain/config';
import { provideRouter } from '@angular/router';
import { MockComponents } from 'ng-mocks';
import { TeacherRunListComponent } from '../teacher-run-list/teacher-run-list.component';
import { DiscourseRecentActivityComponent } from '../discourse-recent-activity/discourse-recent-activity.component';

export class MockUserService {
  getUser(): Observable<User[]> {
    const user: User = new User();
    user.firstName = 'Demo';
    user.lastName = 'Teacher';
    user.roles = ['teacher'];
    user.username = 'DemoTeacher';
    user.id = 123456;
    return new Observable((observer) => {
      observer.next([user]);
      observer.complete();
    });
  }
}

export class MockConfigService {
  getConfig(): Observable<Config> {
    return new Observable((observer) => {
      const config: Config = {
        contextPath: '/wise',
        logOutURL: '/logout',
        currentTime: new Date('2018-10-17T00:00:00.0').getTime()
      };
      observer.next(config);
      observer.complete();
    });
  }

  getContextPath(): string {
    return '/wise';
  }

  getCurrentServerTime(): number {
    return new Date('2018-10-17 00:00:00.0').getTime();
  }

  getDiscourseURL(): string {
    return 'http://localhost:9292';
  }
}

describe('TeacherHomeComponent', () => {
  let component: TeacherHomeComponent;
  let fixture: ComponentFixture<TeacherHomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TeacherHomeComponent,
        MockComponents(DiscourseRecentActivityComponent, TeacherRunListComponent)
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: ConfigService, useClass: MockConfigService },
        provideRouter([])
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component['discourseUrl']).not.toBeNull();
  });
});
