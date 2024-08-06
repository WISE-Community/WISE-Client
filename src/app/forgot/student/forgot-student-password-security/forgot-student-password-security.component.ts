import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../../student/student.service';
import { finalize } from 'rxjs/operators';
import { ReCaptchaV3Service } from 'ng-recaptcha-2';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-forgot-student-password-security',
  templateUrl: './forgot-student-password-security.component.html',
  styleUrls: ['./forgot-student-password-security.component.scss']
})
export class ForgotStudentPasswordSecurityComponent {
  answer: string;
  answerSecurityQuestionFormGroup: FormGroup = this.fb.group({
    answer: new FormControl('', [Validators.required])
  });
  isRecaptchaEnabled: boolean = this.configService.isRecaptchaEnabled();
  message: string;
  processing: boolean = false;
  @Input() question: string;
  @Input() questionKey: string;
  @Input() username: string;

  constructor(
    private configService: ConfigService,
    private fb: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service,
    private router: Router,
    private studentService: StudentService
  ) {}

  async submit() {
    this.processing = true;
    this.clearMessage();
    let token = '';
    if (this.isRecaptchaEnabled) {
      token = await this.recaptchaV3Service.execute('importantAction').toPromise();
    }
    this.studentService
      .checkSecurityAnswer(this.username, this.getAnswer(), token)
      .pipe(
        finalize(() => {
          this.processing = false;
        })
      )
      .subscribe((response) => {
        if (response.status === 'success') {
          this.securityAnswerSuccess();
        } else {
          this.securityAnswerError(response);
        }
      });
  }

  securityAnswerSuccess() {
    const params = {
      username: this.username,
      questionKey: this.questionKey,
      answer: this.getAnswer()
    };
    this.router.navigate(['/forgot/student/password/change'], {
      queryParams: params,
      skipLocationChange: true
    });
  }

  securityAnswerError(response: any): void {
    let message;
    switch (response.messageCode) {
      case 'incorrectAnswer':
        message = $localize`Incorrect answer, please try again. If you can't remember the answer to your security question, please ask your teacher to change your password or contact us for assistance.`;
        break;
      case 'recaptchaResponseInvalid':
        message = $localize`Recaptcha failed. Please reload the page and try again.`;
        break;
    }
    this.setMessage(message);
  }

  getAnswer() {
    return this.getControlFieldValue('answer');
  }

  getControlFieldValue(fieldName) {
    return this.answerSecurityQuestionFormGroup.get(fieldName).value;
  }

  setControlFieldValue(name: string, value: string) {
    this.answerSecurityQuestionFormGroup.controls[name].setValue(value);
  }

  setMessage(message) {
    this.message = message;
  }

  clearMessage() {
    this.setMessage('');
  }
}
