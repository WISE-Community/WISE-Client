import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Config } from '../../../domain/config';
import { ConfigService } from '../../../services/config.service';
import { HeaderAccountMenuComponent } from './header-account-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { User } from '../../../domain/user';

export class MockConfigService {
  getConfig(): Observable<Config> {
    const config: Config = {
      contextPath: '/wise',
      logOutURL: '/logout',
      currentTime: new Date('2018-10-17T00:00:00.0').getTime()
    };
    return Observable.create((observer) => {
      observer.next(config);
      observer.complete();
    });
  }
}

describe('HeaderAccountMenuComponent', () => {
  let component: HeaderAccountMenuComponent;
  let fixture: ComponentFixture<HeaderAccountMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HeaderAccountMenuComponent, MatMenuModule],
      providers: [
        { provide: ConfigService, useClass: MockConfigService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
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

  it('should show all options to non-survey students', () => {
    const headerAccountMenuSections: string[] = fixture.nativeElement
      .querySelectorAll('span')
      .map((element: HTMLElement) => element.innerText);
    expect(headerAccountMenuSections.includes('Student Home')).toBeTrue();
    expect(headerAccountMenuSections.includes('Edit Profile')).toBeTrue();
    expect(headerAccountMenuSections.includes('Help')).toBeTrue();
    expect(headerAccountMenuSections.includes('Sign Out')).toBeTrue();
  });

  it('should only show sign out button to survey students', () => {
    component.user.roles.push('surveyStudent');
    fixture.detectChanges();
    const headerAccountMenuSections: string[] = fixture.nativeElement
      .querySelectorAll('span')
      .map((element: HTMLElement) => element.innerText);
    expect(headerAccountMenuSections.includes('Student Home')).toBeFalse();
    expect(headerAccountMenuSections.includes('Edit Profile')).toBeFalse();
    expect(headerAccountMenuSections.includes('Help')).toBeFalse();
    expect(headerAccountMenuSections.includes('Sign Out')).toBeTrue();
  });
});
