import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConfigService } from '../../../services/config.service';
import { HeaderAccountMenuComponent } from './header-account-menu.component';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { User } from '../../../domain/user';
import { MockProvider } from 'ng-mocks';

describe('HeaderAccountMenuComponent', () => {
  let component: HeaderAccountMenuComponent;
  let fixture: ComponentFixture<HeaderAccountMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HeaderAccountMenuComponent],
      providers: [
        MockProvider(ConfigService, {
          getConfig: () =>
            of({
              contextPath: '/wise',
              logOutURL: '/logout',
              currentTime: new Date('2018-10-17T00:00:00.0').getTime()
            })
        }),
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderAccountMenuComponent);
    component = fixture.componentInstance;
    const user: User = new User();
    user.id = 1;
    user.firstName = 'Amanda';
    user.lastName = 'Panda';
    user.roles = ['student'];
    user.username = 'AmandaP0101';
    component.user = user;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
