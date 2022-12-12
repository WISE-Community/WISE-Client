import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Teacher } from '../../domain/teacher';
import { TeacherService } from '../../teacher/teacher.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UtilService } from '../../services/util.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterUserFormComponent } from '../register-user-form/register-user-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { PasswordService } from '../../services/password.service';

@Component({
  selector: 'app-register-teacher-form',
  templateUrl: './register-teacher-form.component.html',
  styleUrls: ['./register-teacher-form.component.scss']
})
export class RegisterTeacherFormComponent extends RegisterUserFormComponent implements OnInit {
  teacherUser: Teacher = new Teacher();
  schoolLevels: any[] = [
    { code: 'ELEMENTARY_SCHOOL', label: $localize`Elementary School` },
    { code: 'MIDDLE_SCHOOL', label: $localize`Middle School` },
    { code: 'HIGH_SCHOOL', label: $localize`High School` },
    { code: 'COLLEGE', label: $localize`College` },
    { code: 'OTHER', label: $localize`Other` }
  ];
  passwordsFormGroup = this.fb.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(this.passwordService.minLength),
          Validators.pattern(this.passwordService.pattern)
        ]
      ],
      confirmPassword: ['', [Validators.required]]
    },
    { validator: this.passwordMatchValidator }
  );
  createTeacherAccountFormGroup: FormGroup = this.fb.group(
    {
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?![ -])[a-zA-Z -]+(?<![ -])$')
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?![ -])[a-zA-Z -]+(?<![ -])$')
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      schoolName: new FormControl('', [Validators.required]),
      schoolLevel: new FormControl('', [Validators.required]),
      howDidYouHearAboutUs: new FormControl(''),
      agree: new FormControl('')
    },
    { validator: this.agreeCheckboxValidator }
  );
  isSubmitted = false;
  processing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private teacherService: TeacherService,
    private utilService: UtilService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.teacherUser.googleUserId = params['gID'];
      if (!this.isUsingGoogleId()) {
        this.createTeacherAccountFormGroup.addControl('passwords', this.passwordsFormGroup);
      }
      const name = params['name'];
      if (name != null) {
        this.setControlFieldValue('firstName', this.utilService.getFirstName(name));
        this.setControlFieldValue('lastName', this.utilService.getLastName(name));
      }
      this.setControlFieldValue('email', params['email']);
    });
  }

  private isUsingGoogleId(): boolean {
    return this.teacherUser.googleUserId != null;
  }

  private setControlFieldValue(name: string, value: string): void {
    this.createTeacherAccountFormGroup.controls[name].setValue(value);
  }

  createAccount(): void {
    this.isSubmitted = true;
    if (this.createTeacherAccountFormGroup.valid) {
      this.processing = true;
      this.populateTeacherUser();
      this.teacherService.registerTeacherAccount(this.teacherUser).subscribe(
        (response: any) => {
          this.createAccountSuccess(response);
        },
        (response: HttpErrorResponse) => {
          this.createAccountError(response.error);
        }
      );
    }
  }

  private createAccountSuccess(response: any): void {
    this.router.navigate([
      'join/teacher/complete',
      { username: response.username, isUsingGoogleId: this.isUsingGoogleId() }
    ]);
    this.processing = false;
  }

  private createAccountError(error: any): void {
    const formError: any = {};
    switch (error.messageCode) {
      case 'invalidPasswordLength':
        formError.minlength = true;
        this.passwordsFormGroup.get('password').setErrors(formError);
        break;
      case 'invalidPasswordPattern':
        formError.pattern = true;
        this.passwordsFormGroup.get('password').setErrors(formError);
        break;
      default:
        this.snackBar.open(this.translateCreateAccountErrorMessageCode(error.messageCode));
    }
    this.processing = false;
  }

  private populateTeacherUser(): void {
    for (let key of Object.keys(this.createTeacherAccountFormGroup.controls)) {
      this.teacherUser[key] = this.createTeacherAccountFormGroup.get(key).value;
    }
    if (!this.isUsingGoogleId()) {
      this.teacherUser['password'] = this.getPassword();
      delete this.teacherUser['passwords'];
      delete this.teacherUser['googleUserId'];
    }
  }

  private getPassword(): string {
    return this.passwordsFormGroup.controls['password'].value;
  }

  private passwordMatchValidator(passwordsFormGroup: FormGroup): any {
    const password = passwordsFormGroup.get('password').value;
    const confirmPassword = passwordsFormGroup.get('confirmPassword').value;
    if (password == confirmPassword) {
      return null;
    } else {
      const error = { passwordDoesNotMatch: true };
      passwordsFormGroup.controls['confirmPassword'].setErrors(error);
      return error;
    }
  }

  private agreeCheckboxValidator(createTeacherAccountFormGroup: FormGroup): any {
    const agree = createTeacherAccountFormGroup.get('agree').value;
    if (!agree) {
      const error = { agreeNotChecked: true };
      createTeacherAccountFormGroup.setErrors(error);
      return error;
    }
    return null;
  }
}
