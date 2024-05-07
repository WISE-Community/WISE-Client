import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MobileMenuComponent } from './mobile-menu.component';
import { User } from '../../domain/user';
import { UserService } from '../../services/user.service';

export class MockUserService {
  getUser(): Observable<User> {
    return null;
  }
}

let userService: MockUserService;
let fixture: ComponentFixture<MobileMenuComponent>;
describe('MobileMenuComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MobileMenuComponent],
      providers: [provideRouter([]), { provide: UserService, useValue: new MockUserService() }]
    }).compileComponents();
    fixture = TestBed.createComponent(MobileMenuComponent);
    userService = TestBed.inject(UserService);
  });
  userLoggedIn();
  userLoggedOut();
});

function userLoggedIn() {
  describe('when user is logged in', () => {
    it('should hide account links after component initialized', () => {
      expectUserLoggedIn();
      fixture.detectChanges();
      expectMobileAccountLinksShown(false);
    });
  });
}

function userLoggedOut() {
  describe('when user is logged out', () => {
    it('should show account links after component initialized', () => {
      expectUserLoggedOut();
      fixture.detectChanges();
      expectMobileAccountLinksShown(true);
    });
  });
}

function expectUserLoggedIn() {
  const teacher: User = new User();
  teacher.roles = ['teacher'];
  spyOn(userService, 'getUser').and.returnValue(of(teacher));
}

function expectUserLoggedOut() {
  spyOn(userService, 'getUser').and.returnValue(of(null));
}

function expectMobileAccountLinksShown(isShown: boolean) {
  const accountLinks = fixture.debugElement.query(By.css('#mobileMenuAccountLinks'));
  if (isShown) {
    expect(accountLinks).toBeTruthy();
  } else {
    expect(accountLinks).toBeFalsy();
  }
}
