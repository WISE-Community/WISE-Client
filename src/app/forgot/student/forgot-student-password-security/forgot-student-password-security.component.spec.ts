import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ForgotStudentPasswordSecurityComponent } from './forgot-student-password-security.component';
import { provideRouter, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { StudentService } from '../../../student/student.service';
import { ConfigService } from '../../../services/config.service';
import { ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha-2';

let component: ForgotStudentPasswordSecurityComponent;
let fixture: ComponentFixture<ForgotStudentPasswordSecurityComponent>;
let recaptchaV3Service: ReCaptchaV3Service;
let studentService: StudentService;

class MockStudentService {
  checkSecurityAnswer(username: string, answer: string): Observable<any> {
    return Observable.create((observer) => {
      observer.next({
        status: 'success',
        messageCode: 'correctAnswer'
      });
      observer.complete();
    });
  }
}

class MockConfigService {
  isRecaptchaEnabled() {}
}

describe('ForgotStudentPasswordSecurityComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ForgotStudentPasswordSecurityComponent],
      providers: [
        { provide: StudentService, useClass: MockStudentService },
        { provide: ConfigService, useClass: MockConfigService },
        { provide: RECAPTCHA_V3_SITE_KEY, useValue: '' },
        {
          provide: ReCaptchaV3Service,
          useValue: {
            execute: jasmine.createSpy('execute').and.returnValue(of('mock-token'))
          }
        },
        provideRouter([])
      ]
    })
      .overrideComponent(ForgotStudentPasswordSecurityComponent, {
        remove: {
          imports: [RecaptchaV3Module]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotStudentPasswordSecurityComponent);
    recaptchaV3Service = TestBed.inject(ReCaptchaV3Service);
    component = fixture.componentInstance;
    component.isRecaptchaEnabled = false;
    fixture.detectChanges();
  });

  changePassword();
});

async function changePassword() {
  describe('changePassword()', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should disable the submit button if the answer field is not filled in', () => {
      fixture.detectChanges();
      const submitButton = getSubmitButton();
      expect(submitButton.disabled).toBe(true);
    });

    it('should enable the submit button when the answer field is filled in', () => {
      component.setControlFieldValue('answer', 'cookies');
      fixture.detectChanges();
      const submitButton = getSubmitButton();
      expect(submitButton.disabled).toBe(false);
    });

    it('should not render the message paragraph before anything has gone wrong', () => {
      expect(getWarnElement()).toBeNull();
    });

    it('should show the incorrect answer message', waitForAsync(() => {
      submitAndReceiveResponse('checkSecurityAnswer', 'failure', 'incorrectAnswer');
      expect(getErrorMessage()).toContain('Incorrect answer');
    }));

    it('should show the too many failed attempts message', waitForAsync(() => {
      submitAndReceiveResponse('checkSecurityAnswer', 'failure', 'tooManyFailedAnswerAttempts');
      expect(getErrorMessage()).toContain('too many times');
    }));

    it('should disable the form and show the forgot password link when there are too many failed attempts', waitForAsync(() => {
      component.setControlFieldValue('answer', 'cookies');
      fixture.detectChanges();
      expect(getSubmitButton().disabled).toBe(false);
      submitAndReceiveResponse('checkSecurityAnswer', 'failure', 'tooManyFailedAnswerAttempts');
      expect(getAnswerInput().disabled).toBe(true);
      expect(getSubmitButton().disabled).toBe(true);
      expect(getForgotPasswordLink()).not.toBeNull();
    }));

    it('should show the error occurred message for an unrecognized response code', waitForAsync(() => {
      submitAndReceiveResponse('checkSecurityAnswer', 'failure', 'invalidUsername');
      expect(getErrorMessage()).toContain('An error occurred');
    }));

    it('should navigate to change password page', () => {
      const router = TestBed.inject(Router);
      const navigateSpy = spyOn(router, 'navigate');
      const username = 'SpongebobS0101';
      const questionKey = 'QUESTION_ONE';
      const answer = 'cookie';
      component.username = username;
      component.questionKey = questionKey;
      component.setControlFieldValue('answer', answer);
      component.securityAnswerSuccess();
      const params = {
        username: username,
        questionKey: questionKey,
        answer: answer
      };
      expect(navigateSpy).toHaveBeenCalledWith(['/forgot/student/password/change'], {
        queryParams: params,
        skipLocationChange: true
      });
    });

    it('should show error when Recaptcha is invalid', waitForAsync(async () => {
      component.isRecaptchaEnabled = true;
      studentService = TestBed.inject(StudentService);
      const observableResponse = createObservableResponse('failed', 'recaptchaResponseInvalid');
      spyOn(studentService, 'checkSecurityAnswer').and.returnValue(observableResponse);
      await component.submit();
      fixture.detectChanges();
      expect(getErrorMessage()).toContain('Recaptcha failed.');
    }));
  });
}

async function submitAndReceiveResponse(studentServiceFunctionName, status, messageCode) {
  studentService = TestBed.inject(StudentService);
  const observableResponse = createObservableResponse(status, messageCode);
  spyOn(studentService, studentServiceFunctionName).and.returnValue(observableResponse);
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
  const errorMessageDiv = fixture.debugElement.nativeElement.querySelector('.warn');
  return errorMessageDiv == null ? '' : errorMessageDiv.textContent;
}

function getSubmitButton() {
  return fixture.debugElement.nativeElement.querySelector('button[type="submit"]');
}

function getWarnElement() {
  return fixture.debugElement.nativeElement.querySelector('.warn');
}

function getAnswerInput() {
  return fixture.debugElement.nativeElement.querySelector('#answer');
}

function getForgotPasswordLink() {
  return fixture.debugElement.nativeElement.querySelector('a[href="/forgot/student/password"]');
}
