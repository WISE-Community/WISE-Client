import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TeacherService } from '../../../teacher/teacher.service';
import { finalize } from 'rxjs/operators';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  templateUrl: './forgot-teacher-password-verify.component.html',
  styleUrl: './forgot-teacher-password-verify.component.scss',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    FormsModule,
    FlexModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    NgIf,
    MatError,
    MatButton,
    MatProgressBar,
    RouterLink
  ]
})
export class ForgotTeacherPasswordVerifyComponent {
  @Input() username: string = null;
  protected verificationCodeFormGroup: FormGroup = this.fb.group({
    verificationCode: new FormControl('', [Validators.required])
  });
  protected message: string;
  protected processing: boolean = false;
  protected isVerificationCodeInputEnabled: boolean = true;
  protected isSubmitButtonEnabled: boolean = true;
  protected showForgotPasswordLink: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private teacherService: TeacherService
  ) {}

  getControlField(fieldName) {
    return this.verificationCodeFormGroup.get(fieldName);
  }

  getControlFieldValue(fieldName) {
    return this.getControlField(fieldName).value;
  }

  setControlFieldValue(name: string, value: string) {
    this.verificationCodeFormGroup.controls[name].setValue(value);
  }

  submit(): void {
    this.processing = true;
    this.clearMessage();
    this.showForgotPasswordLink = false;
    const verificationCode = this.getControlFieldValue('verificationCode');
    this.teacherService
      .checkVerificationCode(this.username, verificationCode)
      .pipe(
        finalize(() => {
          this.processing = false;
        })
      )
      .subscribe((response) => {
        if (response.status === 'success') {
          this.goToChangePasswordPage();
        } else {
          if (response.messageCode === 'verificationCodeExpired') {
            this.message = $localize`The verification code has expired. Verification codes are valid for 10 minutes. Please go back to the Teacher Forgot Password page to generate a new one.`;
            this.disableVerificationCodeInput();
            this.disableSubmitButton();
            this.showForgotPasswordLink = true;
          } else if (response.messageCode === 'verificationCodeIncorrect') {
            this.message = $localize`The verification code is invalid. Please try again.`;
          } else if (response.messageCode === 'tooManyVerificationCodeAttempts') {
            this.message = $localize`You have submitted an invalid verification code too many times. For security reasons, we will lock the ability to change your password for 10 minutes. After 10 minutes, please go back to the Teacher Forgot Password page to generate a new verification code.`;
            this.disableVerificationCodeInput();
            this.disableSubmitButton();
            this.showForgotPasswordLink = true;
          }
        }
      });
  }

  private clearMessage(): void {
    this.message = '';
  }

  private disableVerificationCodeInput(): void {
    this.getControlField('verificationCode').disable();
  }

  private disableSubmitButton(): void {
    this.isSubmitButtonEnabled = false;
  }

  goToChangePasswordPage(): void {
    const params = {
      username: this.username,
      verificationCode: this.getControlFieldValue('verificationCode')
    };
    this.router.navigate(['/forgot/teacher/password/change'], {
      queryParams: params,
      skipLocationChange: true
    });
  }
}
