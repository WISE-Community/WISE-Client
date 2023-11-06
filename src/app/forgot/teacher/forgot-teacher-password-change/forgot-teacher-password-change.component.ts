import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { TeacherService } from '../../../teacher/teacher.service';
import { finalize } from 'rxjs/operators';
import { NewPasswordAndConfirmComponent } from '../../../password/new-password-and-confirm/new-password-and-confirm.component';
import { injectPasswordErrors } from '../../../common/password-helper';
import { PasswordErrors } from '../../../domain/password/password-errors';

@Component({
  selector: 'app-forgot-teacher-password-change',
  templateUrl: './forgot-teacher-password-change.component.html',
  styleUrls: ['./forgot-teacher-password-change.component.scss']
})
export class ForgotTeacherPasswordChangeComponent implements OnInit {
  changePasswordFormGroup: FormGroup = this.fb.group({});
  isSubmitButtonEnabled: boolean = true;
  message: string = '';
  processing: boolean = false;
  showForgotPasswordLink = false;
  @Input() username: string = null;
  @Input() verificationCode: string;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private teacherService: TeacherService
  ) {}

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  submit(): void {
    this.clearMessage();
    const newPassword = this.getNewPassword();
    const confirmNewPassword = this.getConfirmNewPassword();
    this.showForgotPasswordLink = false;
    if (this.isPasswordsMatch(newPassword, confirmNewPassword)) {
      this.processing = true;
      this.teacherService
        .changePassword(this.username, this.verificationCode, newPassword, confirmNewPassword)
        .pipe(
          finalize(() => {
            this.processing = false;
          })
        )
        .subscribe(
          () => {
            this.changePasswordSuccess();
          },
          (response) => {
            this.changePasswordError(response.error);
          }
        );
    } else {
      this.setPasswordsDoNotMatchMessage();
    }
  }

  private changePasswordSuccess(): void {
    this.goToSuccessPage();
  }

  private changePasswordError(error: PasswordErrors): void {
    switch (error.messageCode) {
      case 'tooManyVerificationCodeAttempts':
        this.setTooManyVerificationCodeAttemptsMessage();
        this.disablePasswordInputs();
        this.disableSubmitButton();
        this.showForgotPasswordLink = true;
        break;
      case 'verificationCodeExpired':
        this.setVerificationCodeExpiredMessage();
        this.disablePasswordInputs();
        this.disableSubmitButton();
        this.showForgotPasswordLink = true;
        break;
      case 'verificationCodeIncorrect':
        this.setVerificationCodeIncorrectMessage();
        break;
      case 'invalidPassword':
        injectPasswordErrors(this.changePasswordFormGroup, error);
        break;
      case 'passwordDoesNotMatch':
        this.changePasswordFormGroup
          .get(NewPasswordAndConfirmComponent.CONFIRM_NEW_PASSWORD_FORM_CONTROL_NAME)
          .setErrors({ passwordDoesNotMatch: true });
        break;
      default:
        this.setErrorOccurredMessage();
    }
  }

  private getNewPassword(): string {
    return this.getControlFieldValue(NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME);
  }

  private getConfirmNewPassword(): string {
    return this.getControlFieldValue(
      NewPasswordAndConfirmComponent.CONFIRM_NEW_PASSWORD_FORM_CONTROL_NAME
    );
  }

  private getControlField(fieldName: string): AbstractControl {
    return this.changePasswordFormGroup.get(fieldName);
  }

  private getControlFieldValue(fieldName: string): string {
    return this.getControlField(fieldName).value;
  }

  setControlFieldValue(name: string, value: string) {
    this.changePasswordFormGroup.controls[name].setValue(value);
  }

  private isPasswordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  private setVerificationCodeExpiredMessage(): void {
    const message = $localize`The verification code has expired. Verification codes are valid for 10 minutes. Please go back to the Teacher Forgot Password page to generate a new one.`;
    this.setMessage(message);
  }

  private setVerificationCodeIncorrectMessage(): void {
    const message = $localize`The verification code is invalid. Please try again.`;
    this.setMessage(message);
  }

  private setTooManyVerificationCodeAttemptsMessage(): void {
    const message = $localize`You have submitted an invalid verification code too many times. For security reasons, we will lock the ability to change your password for 10 minutes. After 10 minutes, please go back to the Teacher Forgot Password page to generate a new verification code.`;
    this.setMessage(message);
  }

  private setPasswordsDoNotMatchMessage(): void {
    this.setMessage($localize`Passwords do not match, please try again.`);
  }

  private setErrorOccurredMessage(): void {
    this.setMessage($localize`An error occurred. Please try again.`);
  }

  private setMessage(message: string): void {
    this.message = message;
  }

  private clearMessage(): void {
    this.setMessage('');
  }

  private disablePasswordInputs(): void {
    this.getControlField('newPassword').disable();
    this.getControlField('confirmNewPassword').disable();
  }

  private disableSubmitButton(): void {
    this.isSubmitButtonEnabled = false;
  }

  private goToSuccessPage(): void {
    const params = {
      username: this.username
    };
    this.router.navigate(['/forgot/teacher/password/complete'], {
      queryParams: params,
      skipLocationChange: true
    });
  }
}
