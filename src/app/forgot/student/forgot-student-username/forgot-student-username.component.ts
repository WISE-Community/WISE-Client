import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UtilService } from '../../../services/util.service';
import { StudentService } from '../../../student/student.service';
import { finalize } from 'rxjs/operators';
import { MatDivider } from '@angular/material/divider';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  templateUrl: './forgot-student-username.component.html',
  styleUrl: './forgot-student-username.component.scss',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    FormsModule,
    FlexModule,
    ReactiveFormsModule,
    NgIf,
    NgClass,
    ExtendedModule,
    NgFor,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatSelect,
    MatOption,
    MatProgressBar,
    MatDivider,
    RouterLink
  ]
})
export class ForgotStudentUsernameComponent implements OnInit {
  months: any[] = [
    { value: 1, text: $localize`01 (Jan)` },
    { value: 2, text: $localize`02 (Feb)` },
    { value: 3, text: $localize`03 (Mar)` },
    { value: 4, text: $localize`04 (Apr)` },
    { value: 5, text: $localize`05 (May)` },
    { value: 6, text: $localize`06 (Jun)` },
    { value: 7, text: $localize`07 (Jul)` },
    { value: 8, text: $localize`08 (Aug)` },
    { value: 9, text: $localize`09 (Sep)` },
    { value: 10, text: $localize`10 (Oct)` },
    { value: 11, text: $localize`11 (Nov)` },
    { value: 12, text: $localize`12 (Dec)` }
  ];
  days: string[] = [];
  forgotStudentUsernameFormGroup: FormGroup = this.fb.group({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    birthMonth: new FormControl('', [Validators.required]),
    birthDay: new FormControl({ value: '', disabled: true }, [Validators.required])
  });
  foundUsernames: string[] = [];
  message: string;
  isErrorMessage: boolean = false;
  showSearchResults: boolean = false;
  processing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private utilService: UtilService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.forgotStudentUsernameFormGroup.controls['birthMonth'].valueChanges.subscribe((value) => {
      this.setBirthDayOptions();
    });
  }

  setBirthDayOptions() {
    const month = this.forgotStudentUsernameFormGroup.get('birthMonth').value;
    this.days = this.utilService.getDaysInMonth(month);
    if (this.days.length < this.forgotStudentUsernameFormGroup.get('birthDay').value) {
      this.forgotStudentUsernameFormGroup.controls['birthDay'].reset();
    }
    this.forgotStudentUsernameFormGroup.controls['birthDay'].enable();
  }

  submit() {
    this.clearMessage();
    if (this.forgotStudentUsernameFormGroup.valid) {
      this.processing = true;
      const firstName = this.getControlFieldValue('firstName');
      const lastName = this.getControlFieldValue('lastName');
      const birthMonth = parseInt(this.getControlFieldValue('birthMonth'));
      const birthDay = parseInt(this.getControlFieldValue('birthDay'));
      this.studentService
        .getStudentUsernames(firstName, lastName, birthMonth, birthDay)
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
