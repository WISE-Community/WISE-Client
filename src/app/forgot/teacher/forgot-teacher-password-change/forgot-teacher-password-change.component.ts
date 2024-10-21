import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { TeacherService } from '../../../teacher/teacher.service';
import { finalize } from 'rxjs/operators';
import { NewPasswordAndConfirmComponent } from '../../../password/new-password-and-confirm/new-password-and-confirm.component';
import { injectPasswordErrors } from '../../../common/password-helper';
import { PasswordErrors } from '../../../domain/password/password-errors';
import { MatDivider } from '@angular/material/divider';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { PasswordModule } from '../../../password/password.module';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  templateUrl: './forgot-teacher-password-change.component.html',
  styleUrl: './forgot-teacher-password-change.component.scss',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    FormsModule,
    FlexModule,
    ReactiveFormsModule,
    PasswordModule,
    MatButton,
    NgIf,
    MatProgressBar,
    RouterLink,
    MatDivider
  ]
})
export class ForgotTeacherPasswordChangeComponent {
  changePasswordFormGroup: FormGroup = this.fb.group({});
  protected isSubmitButtonEnabled: boolean = true;
  protected message: string = '';
  protected processing: boolean = false;
  protected showForgotPasswordLink = false;
  @Input() username: string = null;
  @Input() verificationCode: string;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private teacherService: TeacherService
  ) {}

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
    this.message = $localize`The verification code has expired. Verification codes are valid for 10 minutes. Please go back to the Teacher Forgot Password page to generate a new one.`;
  }

  private setVerificationCodeIncorrectMessage(): void {
    this.message = $localize`The verification code is invalid. Please try again.`;
  }

  private setTooManyVerificationCodeAttemptsMessage(): void {
    this.message = $localize`You have submitted an invalid verification code too many times. For security reasons, we will lock the ability to change your password for 10 minutes. After 10 minutes, please go back to the Teacher Forgot Password page to generate a new verification code.`;
  }

  private setPasswordsDoNotMatchMessage(): void {
    this.message = $localize`Passwords do not match, please try again.`;
  }

  private setErrorOccurredMessage(): void {
    this.message = $localize`An error occurred. Please try again.`;
  }

  private clearMessage(): void {
    this.message = '';
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
