import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotTeacherPasswordVerifyComponent } from './forgot-teacher-password-verify.component';
import { TeacherService } from '../../../teacher/teacher.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { provideRouter, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export class MockTeacherService {
  checkVerificationCode(username: string, verificationCode: string): Observable<any> {
    return Observable.create((observer) => {
      observer.next({
        status: 'success',
        messageCode: 'verificationCodeCorrect'
      });
      observer.complete();
    });
  }
}

describe('ForgotTeacherPasswordVerifyComponent', () => {
  let component: ForgotTeacherPasswordVerifyComponent;
  let fixture: ComponentFixture<ForgotTeacherPasswordVerifyComponent>;

  const submitAndReceiveResponse = (teacherServiceFunctionName, status, messageCode) => {
    const teacherService = TestBed.inject(TeacherService);
    const observableResponse = createObservableResponse(status, messageCode);
    spyOn(teacherService, teacherServiceFunctionName).and.returnValue(observableResponse);
    component.submit();
    fixture.detectChanges();
  };

  const createObservableResponse = (status, messageCode) => {
    const observableResponse = Observable.create((observer) => {
      const response = {
        status: status,
        messageCode: messageCode
      };
      observer.next(response);
      observer.complete();
    });
    return observableResponse;
  };

  const getErrorMessage = () => {
    return fixture.debugElement.nativeElement.querySelector('.warn').textContent;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, ReactiveFormsModule, ForgotTeacherPasswordVerifyComponent],
      providers: [{ provide: TeacherService, useClass: MockTeacherService }, provideRouter([])]
    });
    fixture = TestBed.createComponent(ForgotTeacherPasswordVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the verification code has expired message', () => {
    submitAndReceiveResponse('checkVerificationCode', 'failure', 'verificationCodeExpired');
    expect(getErrorMessage()).toContain('The verification code has expired');
  });

  it('should show the verification code is incorrect message', () => {
    submitAndReceiveResponse('checkVerificationCode', 'failure', 'verificationCodeIncorrect');
    expect(getErrorMessage()).toContain('The verification code is invalid');
  });

  it('should show the too many verification code attempts message', () => {
    submitAndReceiveResponse('checkVerificationCode', 'failure', 'tooManyVerificationCodeAttempts');
    expect(getErrorMessage()).toContain(
      'You have submitted an invalid verification code too many times'
    );
  });

  it('should navigate to the change password page', () => {
    const router = TestBed.get(Router);
    const navigateSpy = spyOn(router, 'navigate');
    component.goToChangePasswordPage();
    const params = {
      username: null,
      verificationCode: ''
    };
    expect(navigateSpy).toHaveBeenCalledWith(['/forgot/teacher/password/change'], {
      queryParams: params,
      skipLocationChange: true
    });
  });

  it('should navigate to the change password page after successfully submitting the verification code', () => {
    const router = TestBed.get(Router);
    const navigateSpy = spyOn(router, 'navigate');
    component.username = 'SpongebobSquarepants';
    component.setControlFieldValue('verificationCode', '123456');
    component.submit();
    fixture.detectChanges();
    const params = {
      username: 'SpongebobSquarepants',
      verificationCode: '123456'
    };
    expect(navigateSpy).toHaveBeenCalledWith(['/forgot/teacher/password/change'], {
      queryParams: params,
      skipLocationChange: true
    });
  });
});
