import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { User } from '../../domain/user';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { Config } from '../../domain/config';
import { UtilService } from '../../services/util.service';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export class MockUserService {
  getUser(): Observable<User> {
    return new Observable((observer) => {
      const user: User = new User();
      observer.next(user);
      observer.complete();
    });
  }
}

export class MockUtilService {
  showMainMenu() {}
}

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

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: ConfigService, useClass: MockConfigService },
        { provide: UtilService, useClass: MockUtilService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
