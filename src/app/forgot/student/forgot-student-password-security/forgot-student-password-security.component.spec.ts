import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ForgotStudentPasswordSecurityComponent } from './forgot-student-password-security.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { StudentService } from '../../../student/student.service';
import { ConfigService } from '../../../services/config.service';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

let component: ForgotStudentPasswordSecurityComponent;
let fixture: ComponentFixture<ForgotStudentPasswordSecurityComponent>;
let recaptchaV3Service: ReCaptchaV3Service;
let studentService: StudentService;

export class MockStudentService {
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
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ForgotStudentPasswordSecurityComponent],
        imports: [
          RouterTestingModule,
          BrowserAnimationsModule,
          ReactiveFormsModule,
          RecaptchaV3Module
        ],
        providers: [
          { provide: StudentService, useClass: MockStudentService },
          { provide: ConfigService, useClass: MockConfigService },
          { provide: RECAPTCHA_V3_SITE_KEY, useValue: '' }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
    })
  );

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

    it(
      'should show the incorrect answer message',
      waitForAsync(() => {
        submitAndReceiveResponse('checkSecurityAnswer', 'failure', 'incorrectAnswer');
        expect(getErrorMessage()).toContain('Incorrect answer');
      })
    );

    it('should navigate to change password page', () => {
      const router = TestBed.get(Router);
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

    it(
      'should show error when Recaptcha is invalid',
      waitForAsync(async () => {
        component.isRecaptchaEnabled = true;
        studentService = TestBed.get(StudentService);
        const observableResponse = createObservableResponse('failed', 'recaptchaResponseInvalid');
        spyOn(recaptchaV3Service, 'execute').and.returnValue(of('token'));
        spyOn(studentService, 'checkSecurityAnswer').and.returnValue(observableResponse);
        await component.submit();
        fixture.detectChanges();
        expect(getErrorMessage()).toContain('Recaptcha failed.');
      })
    );
  });
}

async function submitAndReceiveResponse(studentServiceFunctionName, status, messageCode) {
  studentService = TestBed.get(StudentService);
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
  return errorMessageDiv.textContent;
}

function getSubmitButton() {
  return fixture.debugElement.nativeElement.querySelector('button[type="submit"]');
}
