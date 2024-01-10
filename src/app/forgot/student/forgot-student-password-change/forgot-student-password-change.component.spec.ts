import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotStudentPasswordChangeComponent } from './forgot-student-password-change.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { StudentService } from '../../../student/student.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PasswordModule } from '../../../password/password.module';
import { PasswordRequirementComponent } from '../../../password/password-requirement/password-requirement.component';

export class MockStudentService {
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotStudentPasswordChangeComponent],
      imports: [
        BrowserAnimationsModule,
        PasswordModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [{ provide: StudentService, useClass: MockStudentService }],
      schemas: [NO_ERRORS_SCHEMA]
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

  it('should submit and navigate to the complete page', () => {
    const router = TestBed.get(Router);
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
