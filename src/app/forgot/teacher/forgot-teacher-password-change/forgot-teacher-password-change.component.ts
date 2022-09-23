import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from '../../../teacher/teacher.service';
import { finalize } from 'rxjs/operators';
import { PasswordService } from '../../../services/password.service';
import { passwordMatchValidator } from '../../../modules/shared/validators/password-match.validator';

@Component({
  selector: 'app-forgot-teacher-password-change',
  templateUrl: './forgot-teacher-password-change.component.html',
  styleUrls: ['./forgot-teacher-password-change.component.scss']
})
export class ForgotTeacherPasswordChangeComponent implements OnInit {
  username: string;
  verificationCode: string;
  changePasswordFormGroup: FormGroup = this.fb.group(
    {
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(this.passwordService.minLength),
        Validators.pattern(this.passwordService.pattern)
      ]),
      confirmNewPassword: new FormControl('', [Validators.required])
    },
    { validator: passwordMatchValidator }
  );
  message: string = '';
  processing: boolean = false;
  isSubmitButtonEnabled: boolean = true;
  showForgotPasswordLink = false;

  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordService,
    private router: Router,
    private route: ActivatedRoute,
    private teacherService: TeacherService
  ) {}

  ngOnInit() {
    this.username = this.route.snapshot.queryParamMap.get('username');
    this.verificationCode = this.route.snapshot.queryParamMap.get('verificationCode');
  }

  submit() {
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

  changePasswordSuccess(): void {
    this.goToSuccessPage();
  }

  changePasswordError(error: any): void {
    const formError: any = {};
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
      case 'invalidPasswordLength':
        formError.minlength = true;
        this.changePasswordFormGroup.get('newPassword').setErrors(formError);
        break;
      case 'invalidPasswordPattern':
        formError.pattern = true;
        this.changePasswordFormGroup.get('newPassword').setErrors(formError);
        break;
      case 'passwordDoesNotMatch':
        formError.passwordDoesNotMatch = true;
        this.changePasswordFormGroup.get('confirmNewPassword').setErrors(formError);
        break;
      default:
        this.setErrorOccurredMessage();
    }
  }

  getNewPassword() {
    return this.getControlFieldValue('newPassword');
  }

  getConfirmNewPassword() {
    return this.getControlFieldValue('confirmNewPassword');
  }

  getControlField(fieldName) {
    return this.changePasswordFormGroup.get(fieldName);
  }

  getControlFieldValue(fieldName) {
    return this.getControlField(fieldName).value;
  }

  setControlFieldValue(name: string, value: string) {
    this.changePasswordFormGroup.controls[name].setValue(value);
  }

  isPasswordsMatch(password, confirmPassword) {
    return password === confirmPassword;
  }

  setVerificationCodeExpiredMessage() {
    const message = $localize`The verification code has expired. Verification codes are valid for 10 minutes. Please go back to the Teacher Forgot Password page to generate a new one.`;
    this.setMessage(message);
  }

  setVerificationCodeIncorrectMessage() {
    const message = $localize`The verification code is invalid. Please try again.`;
    this.setMessage(message);
  }

  setTooManyVerificationCodeAttemptsMessage() {
    const message = $localize`You have submitted an invalid verification code too many times. For security reasons, we will lock the ability to change your password for 10 minutes. After 10 minutes, please go back to the Teacher Forgot Password page to generate a new verification code.`;
    this.setMessage(message);
  }

  setPasswordIsBlankMessage() {
    this.setMessage($localize`Password cannot be blank, please enter a password.`);
  }

  setPasswordsDoNotMatchMessage() {
    this.setMessage($localize`Passwords do not match, please try again.`);
  }

  setErrorOccurredMessage() {
    this.setMessage($localize`An error occurred. Please try again.`);
  }

  setMessage(message) {
    this.message = message;
  }

  clearMessage() {
    this.setMessage('');
  }

  disablePasswordInputs() {
    this.getControlField('newPassword').disable();
    this.getControlField('confirmNewPassword').disable();
  }

  disableSubmitButton() {
    this.isSubmitButtonEnabled = false;
  }

  goToSuccessPage() {
    const params = {
      username: this.username
    };
    this.router.navigate(['/forgot/teacher/password/complete'], {
      queryParams: params,
      skipLocationChange: true
    });
  }
}
