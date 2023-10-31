import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotTeacherPasswordChangeComponent } from './forgot-teacher-password-change.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TeacherService } from '../../../teacher/teacher.service';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { PasswordModule } from '../../../password/password.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { PasswordRequirementComponent } from '../../../password/password-requirement/password-requirement.component';

export class MockTeacherService {
  changePassword(
    username: string,
    verificationCode: string,
    password: string,
    confirmPassword: string
  ): Observable<any> {
    return Observable.create((observer) => {
      observer.next({
        status: 'success',
        messageCode: 'verificationCodeCorrect'
      });
      observer.complete();
    });
  }
}

describe('ForgotTeacherPasswordChangeComponent', () => {
  let component: ForgotTeacherPasswordChangeComponent;
  let fixture: ComponentFixture<ForgotTeacherPasswordChangeComponent>;

  const submitAndReceiveErrorResponse = (messageCode: string) => {
    const observableResponse = throwError({ error: { messageCode: messageCode } });
    spyOn(TestBed.inject(TeacherService), 'changePassword').and.returnValue(observableResponse);
    component.submit();
    fixture.detectChanges();
  };

  const getErrorMessage = () => {
    return fixture.debugElement.nativeElement.querySelector('.warn').textContent;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotTeacherPasswordChangeComponent],
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatDividerModule,
        PasswordModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [{ provide: TeacherService, useClass: MockTeacherService }],
      schemas: []
    });
    fixture = TestBed.createComponent(ForgotTeacherPasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the too many verification code attempts message', () => {
    submitAndReceiveErrorResponse('tooManyVerificationCodeAttempts');
    expect(getErrorMessage()).toContain(
      'You have submitted an invalid verification code too many times'
    );
  });

  it('should show the verification code expired message', () => {
    submitAndReceiveErrorResponse('verificationCodeExpired');
    expect(getErrorMessage()).toContain('The verification code has expired');
  });

  it('should show the verification code incorrect message', () => {
    submitAndReceiveErrorResponse('verificationCodeIncorrect');
    expect(getErrorMessage()).toContain('The verification code is invalid');
  });

  it('should submit and navigate to the complete page', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    component.submit();
    const params = {
      username: null
    };
    expect(navigateSpy).toHaveBeenCalledWith(['/forgot/teacher/password/complete'], {
      queryParams: params,
      skipLocationChange: true
    });
  });

  it('should navigate to the complete page after successfully submitting the new password', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    component.username = 'SpongebobSquarepants';
    component.verificationCode = '123456';
    const newPassword = PasswordRequirementComponent.VALID_PASSWORD;
    component.changePasswordFormGroup.controls['newPassword'].setValue(newPassword);
    component.changePasswordFormGroup.controls['confirmNewPassword'].setValue(newPassword);
    component.submit();
    fixture.detectChanges();
    const params = {
      username: 'SpongebobSquarepants'
    };
    expect(navigateSpy).toHaveBeenCalledWith(['/forgot/teacher/password/complete'], {
      queryParams: params,
      skipLocationChange: true
    });
  });
});
