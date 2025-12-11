import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterTeacherComponent } from './register-teacher.component';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { Config } from '../../domain/config';
import { ConfigService } from '../../services/config.service';
import { provideRouter } from '@angular/router';

export class MockConfigService {
  getConfig(): Observable<Config> {
    const config: Config = {
      contextPath: '/wise',
      logOutURL: '/logout',
      currentTime: new Date('2018-10-17T00:00:00.0').getTime()
    };
    return new Observable((observer) => {
      observer.next(config);
      observer.complete();
    });
  }
}

export class MockUserService {}

describe('RegisterTeacherComponent', () => {
  let component: RegisterTeacherComponent;
  let fixture: ComponentFixture<RegisterTeacherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RegisterTeacherComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: ConfigService, useClass: MockConfigService },
        provideRouter([])
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
