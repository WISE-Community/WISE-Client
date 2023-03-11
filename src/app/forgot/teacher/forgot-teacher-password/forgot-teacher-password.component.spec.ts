import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ForgotTeacherPasswordComponent } from './forgot-teacher-password.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TeacherService } from '../../../teacher/teacher.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ConfigService } from '../../../services/config.service';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

let component: ForgotTeacherPasswordComponent;
let configService: ConfigService;
let fixture: ComponentFixture<ForgotTeacherPasswordComponent>;
let recaptchaV3Service: ReCaptchaV3Service;
let teacherService: TeacherService;

function submitAndReceiveResponse(teacherServiceFunctionName, status, messageCode) {
  const teacherService = TestBed.get(TeacherService);
  const observableResponse = createObservableResponse(status, messageCode);
  spyOn(teacherService, teacherServiceFunctionName).and.returnValue(observableResponse);
  component.submit();
  fixture.detectChanges();
}

function createObservableResponse(status, messageCode) {
  const observableResponse = Observable.create((observer) => {
    const response = {
      status: status,
      messageCode: messageCode
    };
    observer.next(response);
    observer.complete();
  });
  return observableResponse;
}

function getErrorMessage() {
  const errorMessage = fixture.debugElement.nativeElement.querySelector('.warn');
  return errorMessage.textContent;
}

export class MockTeacherService {
  getVerificationCodeEmail(username: string): Observable<any> {
    return Observable.create((observer) => {
      observer.next({
        status: 'success',
        messageCode: 'emailSent'
      });
      observer.complete();
    });
  }
}

class MockConfigService {
  isRecaptchaEnabled() {}
}

describe('ForgotTeacherPasswordComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ForgotTeacherPasswordComponent],
        imports: [RouterTestingModule, ReactiveFormsModule, RecaptchaV3Module],
        providers: [
          { provide: TeacherService, useClass: MockTeacherService },
          { provide: ConfigService, useClass: MockConfigService },
          { provide: RECAPTCHA_V3_SITE_KEY, useValue: '' }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
    })
  );

  beforeEach(() => {
    configService = TestBed.inject(ConfigService);
    fixture = TestBed.createComponent(ForgotTeacherPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  changePassword();
});

function changePassword() {
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the username not found message', () => {
    submitAndReceiveResponse('getVerificationCodeEmail', 'failure', 'usernameNotFound');
    expect(getErrorMessage()).toContain('We could not find that username');
  });

  it('should show the too many verification code attempts message', () => {
    submitAndReceiveResponse(
      'getVerificationCodeEmail',
      'failure',
      'tooManyVerificationCodeAttempts'
    );
    expect(getErrorMessage()).toContain(
      'You have submitted an invalid verification code too many times'
    );
  });

  it('should show the failed to send email message', () => {
    submitAndReceiveResponse('getVerificationCodeEmail', 'failure', 'failedToSendEmail');
    expect(getErrorMessage()).toContain(
      'The server has encountered an error and was unable to send you an email'
    );
  });

  it('should show error when Recaptcha is invalid', () => {
    submitAndReceiveResponse('getVerificationCodeEmail', 'failure', 'recaptchaResponseInvalid');
    expect(getErrorMessage()).toContain('Recaptcha failed');
  });

  it('should navigate to the verify code page', () => {
    const router = TestBed.get(Router);
    const navigateSpy = spyOn(router, 'navigate');
    component.goToVerificationCodePage();
    const params = {
      username: ''
    };
    expect(navigateSpy).toHaveBeenCalledWith(['/forgot/teacher/password/verify'], {
      queryParams: params,
      skipLocationChange: true
    });
  });

  it('should navigate to the verify code page after successfully sending a valid username', () => {
    const router = TestBed.get(Router);
    const navigateSpy = spyOn(router, 'navigate');
    component.setControlFieldValue('username', 'SpongebobSquarepants');
    component.submit();
    fixture.detectChanges();
    const params = {
      username: 'SpongebobSquarepants'
    };
    expect(navigateSpy).toHaveBeenCalledWith(['/forgot/teacher/password/verify'], {
      queryParams: params,
      skipLocationChange: true
    });
  });
}
