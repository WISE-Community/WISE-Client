import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { LoginHomeComponent } from './login-home.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service } from 'ng-recaptcha-2';
import { By } from '@angular/platform-browser';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { getErrorMessage } from '../../common/test-helper';
import { DebugElement } from '@angular/core';

let component: LoginHomeComponent;
let configService: ConfigService;
const contextPath: string = '/wise';
let fixture: ComponentFixture<LoginHomeComponent>;
let http: HttpClient;
const recaptchaPrivateKey: string = 'the-private-key';
let recaptchaV3Service: ReCaptchaV3Service;
const redirectUrl: string = `${contextPath}/api/j_acegi_security_check`;
let router: Router;
let userService: UserService;

describe('LoginHomeComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LoginHomeComponent],
      providers: [
        ConfigService,
        { provide: RECAPTCHA_V3_SITE_KEY, useValue: recaptchaPrivateKey },
        ReCaptchaV3Service,
        UserService,
        provideHttpClient(),
        provideRouter([])
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    configService = TestBed.inject(ConfigService);
    http = TestBed.inject(HttpClient);
    recaptchaV3Service = TestBed.inject(ReCaptchaV3Service);
    router = TestBed.inject(Router);
    userService = TestBed.inject(UserService);
    spyOn(userService, 'getRedirectUrl').and.returnValue(redirectUrl);
    spyOn(configService, 'getRecaptchaPublicKey').and.returnValue('the-public-key');
    spyOn(configService, 'getContextPath').and.returnValue(contextPath);
    fixture = TestBed.createComponent(LoginHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  getRedirectUrl();
  login();
});

function getRedirectUrl() {
  describe('getRedirectUrl()', () => {
    it('should add redirectUrl to Google login url', () => {
      expect(component.getRedirectUrl('google')).toEqual(
        `${contextPath}/api/google-login?redirectUrl=${redirectUrl}`
      );
    });
  });
}

function login() {
  describe('login()', () => {
    loginWithRecaptchaDisabled();
    loginWithRecaptchaEnabled();
  });
}

function loginWithRecaptchaDisabled() {
  describe('recaptcha is disabled', () => {
    beforeEach(() => {
      component.isRecaptchaEnabled = false;
    });
    incorrectPassword();
    correctPasswordVerifiedAccount();
    unverifiedAccount();
    unverifiedAccountWaitToResendEmail();
  });
}

function incorrectPassword() {
  describe('user enters incorrect password', () => {
    it('should show authentication error message', fakeAsync(() => {
      spyOn(http, 'post').and.returnValue(of({}));
      spyOn(http, 'get').and.returnValue(of(null));
      spyOn(userService, 'isVerified').and.returnValue(of(true));
      component.login();
      tickAndDetectChanges();
      const errorMessageElement = getErrorMessageElement(
        'Username and password not recognized. Please try again.'
      );
      expect(errorMessageElement).toBeDefined();
      expect(errorMessageElement!.nativeElement.classList.contains('warn')).toBeTruthy();
      expect(component.credentials.password).toEqual('');
    }));
  });
}

function correctPasswordVerifiedAccount() {
  describe('user enters correct password and account is verified', () => {
    it('should navigate to home page', fakeAsync(() => {
      spyOn(http, 'post').and.returnValue(of({}));
      spyOn(http, 'get').and.returnValue(of({ id: 1 }));
      spyOn(userService, 'isVerified').and.returnValue(of(true));
      const routerNavigateSpy = spyOn(router, 'navigateByUrl');
      component.login();
      tickAndDetectChanges();
      expect(routerNavigateSpy).toHaveBeenCalledWith(redirectUrl);
    }));
  });
}

function unverifiedAccount() {
  describe('login attempt with unverified account', () => {
    it('should show verification error message', fakeAsync(() => {
      spyOn(userService, 'isVerified').and.returnValue(of(false));
      spyOn(userService, 'authenticate').and.callFake(() => {
        component['verificationState'].set('unverified');
      });
      component.login();
      tickAndDetectChanges();
      const errorMessageElement = getErrorMessageElement(
        'Your email has not been verified. Check your email for a verification link.'
      );
      const resendLinkElement = getErrorMessageElement(
        'Click here to resend the verification email.'
      );
      expect(errorMessageElement).toBeDefined();
      expect(errorMessageElement!.nativeElement.classList.contains('warn')).toBeTruthy();
      expect(resendLinkElement).toBeDefined();
      expect(resendLinkElement!.nativeElement.classList.contains('warn')).toBeTruthy();
    }));
  });
}

function unverifiedAccountWaitToResendEmail() {
  describe('login attempt with unverified account and must wait to resend the email', () => {
    it('should show verification error message with countdown to resend', fakeAsync(() => {
      spyOn(userService, 'isVerified').and.returnValue(of(false));
      spyOn(userService, 'authenticate').and.callFake(() => {
        component['verificationState'].set('unverified');
      });
      component['resendEmailWaitSeconds'].set(60);
      component.login();
      tickAndDetectChanges();
      const errorMessageElement = getErrorMessageElement(
        'Your email has not been verified. Check your email for a verification link.'
      );
      const resendLinkElement = getErrorMessageElement(
        'Please wait to send another verification email (60).'
      );
      expect(errorMessageElement).toBeDefined();
      expect(errorMessageElement!.nativeElement.classList.contains('warn')).toBeTruthy();
      expect(resendLinkElement).toBeDefined();
      expect(resendLinkElement!.nativeElement.classList.contains('warn')).toBeTruthy();
    }));
  });
}

function loginWithRecaptchaEnabled() {
  xdescribe('recaptcha is enabled', () => {
    beforeEach(() => {
      component.isRecaptchaEnabled = true;
      spyOn(recaptchaV3Service, 'execute').and.returnValue(of('token'));
    });

    describe('recaptcha verification fails', () => {
      it('should show the recaptcha error message', fakeAsync(() => {
        spyOn(http, 'post').and.returnValue(of({ isRecaptchaVerificationFailed: true }));
        spyOn(http, 'get').and.returnValue(of(null));
        component.login();
        tickAndDetectChanges();
        expect(getErrorMessage(fixture)).toEqual(
          'Recaptcha failed. Please reload the page and try again!'
        );
      }));
    });
  });
}

function tickAndDetectChanges() {
  tick();
  fixture.detectChanges();
}

function getErrorMessageElement(errorMsg: string): DebugElement | undefined {
  return fixture.debugElement
    .queryAll(By.css('p'))
    .find((element) => element.nativeElement.textContent.trim() === errorMsg);
}
