import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from '../../../teacher/teacher.service';
import { finalize } from 'rxjs/operators';
import { ReCaptchaV3Service } from 'ng-recaptcha-2';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-forgot-teacher-password',
  templateUrl: './forgot-teacher-password.component.html',
  styleUrls: ['./forgot-teacher-password.component.scss']
})
export class ForgotTeacherPasswordComponent implements OnInit {
  forgotTeacherPasswordFormGroup: FormGroup = this.fb.group({
    username: new FormControl('', [Validators.required])
  });
  isRecaptchaEnabled: boolean = this.configService.isRecaptchaEnabled();
  message: string = '';
  showForgotUsernameLink: boolean = false;
  processing: boolean = false;

  constructor(
    private configService: ConfigService,
    private fb: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service,
    private router: Router,
    private teacherService: TeacherService
  ) {}

  ngOnInit() {}

  getControlFieldValue(fieldName) {
    return this.forgotTeacherPasswordFormGroup.get(fieldName).value;
  }

  setControlFieldValue(name: string, value: string) {
    this.forgotTeacherPasswordFormGroup.controls[name].setValue(value);
  }

  async submit() {
    this.processing = true;
    this.clearMessage();
    this.showForgotUsernameLink = false;
    const username = this.getControlFieldValue('username');
    let token = '';
    if (this.isRecaptchaEnabled) {
      token = await this.recaptchaV3Service.execute('importantAction').toPromise();
    }
    this.teacherService
      .getVerificationCodeEmail(username, token)
      .pipe(
        finalize(() => {
          this.processing = false;
        })
      )
      .subscribe((response) => {
        if (response.status === 'success') {
          this.verificationCodeEmailSuccess();
        } else {
          this.verificationCodeEmailError(response);
        }
      });
  }

  verificationCodeEmailSuccess() {
    const params = {
      username: this.getControlFieldValue('username')
    };
    this.router.navigate(['/forgot/teacher/password/verify'], {
      queryParams: params,
      skipLocationChange: true
    });
  }

  verificationCodeEmailError(response: any): void {
    let message;
    switch (response.messageCode) {
      case 'usernameNotFound':
        message = $localize`We could not find that username. Please make sure you are typing it correctly and try again. If you have forgotten your username, please use the forgot username option below.`;
        this.showForgotUsernameLink = true;
        break;
      case 'tooManyVerificationCodeAttempts':
        message = $localize`You have submitted an invalid verification code too many times. For security reasons, we will lock the ability to change your password for 10 minutes. After 10 minutes, you can try again.`;
        break;
      case 'failedToSendEmail':
        message = $localize`The server has encountered an error and was unable to send you an email. Please try again. If the error continues to occur, please contact us.`;
        break;
      case 'recaptchaResponseInvalid':
        message = $localize`Recaptcha failed. Please reload the page and try again.`;
        break;
    }
    this.setMessage(message);
  }

  setMessage(message) {
    this.message = message;
  }

  clearMessage() {
    this.setMessage('');
  }
}
