import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotStudentPasswordChangeComponent } from './forgot-student-password-change.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentService } from '../../../student/student.service';
import { provideRouter, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { PasswordRequirementComponent } from '../../../password/password-requirement/password-requirement.component';

class MockStudentService {
  changePassword(
    username: string,
    answer: string,
    password: string,
    confirmPassword: string
  ): Observable<any> {
    return Observable.create((observer) => {
      observer.next({
        status: 'success',
        messageCode: 'passwordChanged'
      });
      observer.complete();
    });
  }
}

describe('ForgotStudentPasswordChangeComponent', () => {
  let component: ForgotStudentPasswordChangeComponent;
  let fixture: ComponentFixture<ForgotStudentPasswordChangeComponent>;

  const getSubmitButton = () => {
    return fixture.debugElement.nativeElement.querySelector('button[type="submit"]');
  };

  const getErrorMessage = () => {
    const errorMessageDiv = fixture.debugElement.nativeElement.querySelector('.warn');
    return errorMessageDiv == null ? '' : errorMessageDiv.textContent;
  };

  const getForgotPasswordLink = () => {
    return fixture.debugElement.nativeElement.querySelector('a[href="/forgot/student/password"]');
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, ForgotStudentPasswordChangeComponent],
      providers: [{ provide: StudentService, useClass: MockStudentService }, provideRouter([])]
    });
    fixture = TestBed.createComponent(ForgotStudentPasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button when the password fields are not filled in', () => {
    fixture.detectChanges();
    const submitButton = getSubmitButton();
    expect(submitButton.disabled).toBe(true);
  });

  it('should enable the submit button when the password fields are filled in', () => {
    const password = PasswordRequirementComponent.VALID_PASSWORD;
    component.changePasswordFormGroup.controls['newPassword'].setValue(password);
    component.changePasswordFormGroup.controls['confirmNewPassword'].setValue(password);
    fixture.detectChanges();
    const submitButton = getSubmitButton();
    expect(submitButton.disabled).toBe(false);
  });

  it('should disable the form and show the forgot password link when there are too many failed attempts', () => {
    const password = PasswordRequirementComponent.VALID_PASSWORD;
    component.changePasswordFormGroup.controls['newPassword'].setValue(password);
    component.changePasswordFormGroup.controls['confirmNewPassword'].setValue(password);
    fixture.detectChanges();
    expect(getSubmitButton().disabled).toBe(false);
    const studentService = TestBed.inject(StudentService);
    spyOn(studentService, 'changePassword').and.returnValue(
      throwError(() => ({ error: { messageCode: 'tooManyFailedAnswerAttempts' } }))
    );
    component.submit();
    fixture.detectChanges();
    expect(getErrorMessage()).toContain('too many times');
    expect(component.changePasswordFormGroup.controls['newPassword'].disabled).toBe(true);
    expect(getSubmitButton().disabled).toBe(true);
    expect(getForgotPasswordLink()).not.toBeNull();
  });

  it('should not render the message paragraph before anything has gone wrong', () => {
    expect(fixture.debugElement.nativeElement.querySelector('.warn')).toBeNull();
  });

  it('should submit and navigate to the complete page', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    const username = 'SpongebobS0101';
    component.username = username;
    component.submit();
    const params = {
      username: username
    };
    expect(navigateSpy).toHaveBeenCalledWith(['/forgot/student/password/complete'], {
      queryParams: params,
      skipLocationChange: true
    });
  });
});
