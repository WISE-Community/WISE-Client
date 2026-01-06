import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { StudentService } from '../../../student/student.service';
import { finalize } from 'rxjs/operators';
import { ReCaptchaV3Service } from 'ng-recaptcha-2';
import { ConfigService } from '../../../services/config.service';
import { MatDivider } from '@angular/material/divider';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  templateUrl: './forgot-student-password-security.component.html',
  styleUrl: './forgot-student-password-security.component.scss',
  imports: [
    MatCard,
    MatCardContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatButton,
    MatProgressBar,
    MatDivider,
    RouterLink
  ]
})
export class ForgotStudentPasswordSecurityComponent {
  private configService = inject(ConfigService);
  private fb = inject(FormBuilder);
  private recaptchaV3Service = inject(ReCaptchaV3Service);
  private router = inject(Router);
  private studentService = inject(StudentService);

  protected answer: string;
  protected answerSecurityQuestionFormGroup: FormGroup = this.fb.group({
    answer: new FormControl('', [Validators.required])
  });
  isRecaptchaEnabled: boolean = this.configService.isRecaptchaEnabled();
  protected message: string;
  protected processing: boolean = false;
  @Input() question: string;
  @Input() questionKey: string;
  @Input() username: string;

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
    this.message = message;
  }

  getAnswer() {
    return this.getControlFieldValue('answer');
  }

  getControlFieldValue(fieldName) {
    return this.answerSecurityQuestionFormGroup.get(fieldName).value;
  }

  setControlFieldValue(name: string, value: string): void {
    this.answerSecurityQuestionFormGroup.controls[name].setValue(value);
  }

  private clearMessage(): void {
    this.message = '';
  }
}
