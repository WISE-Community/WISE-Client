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
import { StudentService } from '../../../student/student.service';
import { finalize } from 'rxjs/operators';
import { MatDivider } from '@angular/material/divider';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  templateUrl: './forgot-student-username.component.html',
  styleUrl: './forgot-student-username.component.scss',
  imports: [
    MatCard,
    MatCardContent,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatProgressBar,
    MatDivider,
    RouterLink
  ]
})
export class ForgotStudentUsernameComponent {
  forgotStudentUsernameFormGroup: FormGroup = this.fb.group({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required])
  });
  foundUsernames: string[] = [];
  message: string;
  isErrorMessage: boolean = false;
  showSearchResults: boolean = false;
  processing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private studentService: StudentService
  ) {}

  submit() {
    this.clearMessage();
    if (this.forgotStudentUsernameFormGroup.valid) {
      this.processing = true;
      const firstName = this.getControlFieldValue('firstName');
      const lastName = this.getControlFieldValue('lastName');
      this.studentService
        .getStudentUsernames(firstName, lastName)
        .pipe(
          finalize(() => {
            this.processing = false;
          })
        )
        .subscribe((response) => {
          this.foundUsernames = response;
          this.setMessageForFoundUsernames();
          this.showSearchResults = true;
        });
    }
  }

  setMessageForFoundUsernames() {
    const foundUsernamesCount = this.foundUsernames.length;
    if (foundUsernamesCount === 0) {
      this.message = $localize`We did not find any usernames that match the information you provided. Please make sure you entered your information correctly. If you can't find your account, ask a teacher for help or contact us for assistance.`;
      this.isErrorMessage = true;
    } else if (foundUsernamesCount === 1) {
      this.message = $localize`We found a username that matches. Select it to log in. If this username is not yours, ask a teacher for help or contact us for assistance.`;
      this.isErrorMessage = false;
    } else if (foundUsernamesCount > 1) {
      this.message = $localize`We found multiple usernames that match. If one of these is yours, select it to log in. If you can't find your account, ask a teacher for help or contact us for assistance.`;
      this.isErrorMessage = false;
    }
  }

  private clearMessage(): void {
    this.message = '';
  }

  getControlFieldValue(fieldName) {
    return this.forgotStudentUsernameFormGroup.get(fieldName).value;
  }

  setControlFieldValue(name: string, value: string): void {
    this.forgotStudentUsernameFormGroup.controls[name].setValue(value);
  }

  loginWithUsername(username: string): void {
    this.router.navigate(['/login', { username: username }]);
  }
}
