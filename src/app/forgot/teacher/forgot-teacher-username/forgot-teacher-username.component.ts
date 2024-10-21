import { Component } from '@angular/core';
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
import { MatDivider } from '@angular/material/divider';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  templateUrl: './forgot-teacher-username.component.html',
  styleUrl: './forgot-teacher-username.component.scss',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    FormsModule,
    FlexModule,
    ReactiveFormsModule,
    NgIf,
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
export class ForgotTeacherUsernameComponent {
  protected forgotTeacherUsernameFormGroup: FormGroup = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  protected message: string = '';
  protected processing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private teacherService: TeacherService
  ) {}

  getControlFieldValue(fieldName) {
    return this.forgotTeacherUsernameFormGroup.get(fieldName).value;
  }

  setControlFieldValue(name: string, value: string) {
    this.forgotTeacherUsernameFormGroup.controls[name].setValue(value);
  }

  getEmail() {
    return this.getControlFieldValue('email');
  }

  submit(): void {
    this.processing = true;
    this.clearMessage();
    const email = this.getEmail();
    this.teacherService
      .sendForgotUsernameEmail(email)
      .pipe(
        finalize(() => {
          this.processing = false;
        })
      )
      .subscribe((response) => {
        if (response.status === 'success') {
          this.router.navigate(['/forgot/teacher/username/complete']);
        } else {
          if (response.messageCode === 'emailNotFound') {
            this.setEmailNotFoundMessage();
          } else if (response.messageCode === 'failedToSendEmail') {
            this.setFailedToSendEmailMessage();
          }
        }
      });
  }

  private setEmailNotFoundMessage(): void {
    this.message = $localize`We did not find a WISE account associated with that email. Please make sure you have typed your email address correctly.`;
  }

  private setFailedToSendEmailMessage(): void {
    this.message = $localize`The server has encountered an error and was unable to send an email to you. Please try again. If the error continues to occur, please contact us.`;
  }

  private clearMessage(): void {
    this.message == '';
  }
}
