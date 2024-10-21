import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { StudentService } from '../../../student/student.service';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MatDivider } from '@angular/material/divider';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  templateUrl: './forgot-student-password.component.html',
  styleUrl: './forgot-student-password.component.scss',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    FormsModule,
    FlexModule,
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatButton,
    MatProgressBar,
    MatDivider
  ]
})
export class ForgotStudentPasswordComponent {
  protected forgotStudentPasswordFormGroup: FormGroup = this.fb.group({
    username: new FormControl('', [Validators.required])
  });
  protected message: string;
  protected showForgotUsernameLink: boolean = false;
  protected processing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private studentService: StudentService
  ) {}

  submit(): void {
    this.processing = true;
    this.clearMessage();
    this.showForgotUsernameLink = false;
    const username = this.getUsername();
    this.studentService
      .getSecurityQuestion(username)
      .pipe(
        finalize(() => {
          this.processing = false;
        })
      )
      .subscribe((response) => {
        if (response.status === 'success') {
          this.goToQuestionPage(username, response.questionKey, response.question);
        } else {
          if (response.messageCode === 'usernameNotFound') {
            this.setUsernameNotFoundMessage();
            this.showForgotUsernameLink = true;
          }
        }
      });
  }

  getUsername() {
    return this.getControlFieldValue('username');
  }

  getControlFieldValue(fieldName) {
    return this.forgotStudentPasswordFormGroup.get(fieldName).value;
  }

  setControlFieldValue(name: string, value: string) {
    this.forgotStudentPasswordFormGroup.controls[name].setValue(value);
  }

  goToQuestionPage(username, questionKey, question) {
    const params = {
      username: username,
      questionKey: questionKey,
      question: question
    };
    this.router.navigate(['/forgot/student/password/security'], {
      queryParams: params,
      skipLocationChange: true
    });
  }

  private setUsernameNotFoundMessage(): void {
    this.message = $localize`We could not find that username. Please make sure you are typing it correctly and try again. If you have forgotten your username, please use the forgot username option below.`;
  }

  private clearMessage(): void {
    this.message = '';
  }
}
