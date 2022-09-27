import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginGoogleUserNotFoundComponent } from './login-google-user-not-found.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { RouterTestingModule } from '@angular/router/testing';

export class MockUserService {}

export class MockAuthService {}

describe('LoginGoogleUserNotFoundComponent', () => {
  let component: LoginGoogleUserNotFoundComponent;
  let fixture: ComponentFixture<LoginGoogleUserNotFoundComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LoginGoogleUserNotFoundComponent],
        imports: [RouterTestingModule],
        providers: [
          { provide: UserService, useClass: MockUserService },
          { provide: SocialAuthService, useClass: MockAuthService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginGoogleUserNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
