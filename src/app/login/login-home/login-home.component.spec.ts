import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { LoginHomeComponent } from './login-home.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService } from '../../services/config.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha';
import { By } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { getErrorMessage } from '../../common/test-helper';

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
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LoginHomeComponent],
        imports: [HttpClientTestingModule, RecaptchaV3Module, RouterTestingModule],
        providers: [
          ConfigService,
          { provide: RECAPTCHA_V3_SITE_KEY, useValue: recaptchaPrivateKey },
          ReCaptchaV3Service,
          UserService
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

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
    correctPassword();
  });
}

function incorrectPassword() {
  describe('user enters incorrect password', () => {
    it('should show error message', fakeAsync(() => {
      spyOn(http, 'post').and.returnValue(of({}));
      spyOn(http, 'get').and.returnValue(of(null));
      component.login();
      tickAndDetectChanges();
      const errorMessageElement = fixture.debugElement
        .queryAll(By.css('p'))
        .find(
          (element) =>
            element.nativeElement.textContent.trim() ===
            'Username and password not recognized. Please try again.'
        );
      expect(errorMessageElement.nativeElement.classList.contains('warn')).toBeTruthy();
      expect(component.credentials.password).toEqual('');
    }));
  });
}

function correctPassword() {
  describe('user enters correct password', () => {
    it('should navigate to home page', fakeAsync(() => {
      spyOn(http, 'post').and.returnValue(of({}));
      spyOn(http, 'get').and.returnValue(of({ id: 1 }));
      const routerNavigateSpy = spyOn(router, 'navigateByUrl');
      component.login();
      tickAndDetectChanges();
      expect(routerNavigateSpy).toHaveBeenCalledWith(redirectUrl);
    }));
  });
}

function loginWithRecaptchaEnabled() {
  describe('recaptcha is enabled', () => {
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
