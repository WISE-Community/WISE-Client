import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Student } from '../../domain/student';
import { StudentService } from '../../student/student.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UtilService } from '../../services/util.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterUserFormComponent } from '../register-user-form/register-user-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { PasswordService } from '../../services/password.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { NewPasswordAndConfirmComponent } from '../../password/new-password-and-confirm/new-password-and-confirm.component';

@Component({
  selector: 'register-student-form',
  templateUrl: './register-student-form.component.html',
  styleUrls: ['./register-student-form.component.scss']
})
export class RegisterStudentFormComponent extends RegisterUserFormComponent implements OnInit {
  createStudentAccountFormGroup: FormGroup = this.fb.group({
    firstName: new FormControl('', [Validators.required, Validators.pattern(this.NAME_REGEX)]),
    lastName: new FormControl('', [Validators.required, Validators.pattern(this.NAME_REGEX)]),
    gender: new FormControl('', [Validators.required]),
    birthMonth: new FormControl('', [Validators.required]),
    birthDay: new FormControl({ value: '', disabled: true }, [Validators.required])
  });
  days: string[] = [];
  genders: any[] = [
    { code: 'FEMALE', label: $localize`Female` },
    { code: 'MALE', label: $localize`Male` },
    { code: 'NO_ANSWER', label: $localize`No Answer/Other` }
  ];
  months: any[] = [
    { code: '1', label: $localize`01 (Jan)` },
    { code: '2', label: $localize`02 (Feb)` },
    { code: '3', label: $localize`03 (Mar)` },
    { code: '4', label: $localize`04 (Apr)` },
    { code: '5', label: $localize`05 (May)` },
    { code: '6', label: $localize`06 (Jun)` },
    { code: '7', label: $localize`07 (Jul)` },
    { code: '8', label: $localize`08 (Aug)` },
    { code: '9', label: $localize`09 (Sep)` },
    { code: '10', label: $localize`10 (Oct)` },
    { code: '11', label: $localize`11 (Nov)` },
    { code: '12', label: $localize`12 (Dec)` }
  ];
  passwordsFormGroup: FormGroup = this.fb.group({});
  processing: boolean = false;
  securityQuestions: object;
  studentUser: Student = new Student();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private studentService: StudentService,
    private utilService: UtilService
  ) {
    super();
    this.studentService.retrieveSecurityQuestions().subscribe((response) => {
      this.securityQuestions = response;
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.studentUser.googleUserId = params['gID'];
      if (!this.isUsingGoogleId()) {
        this.createStudentAccountFormGroup.addControl('passwords', this.passwordsFormGroup);
        this.createStudentAccountFormGroup.addControl(
          'securityQuestion',
          new FormControl('', [Validators.required])
        );
        this.createStudentAccountFormGroup.addControl(
          'securityQuestionAnswer',
          new FormControl('', [Validators.required])
        );
      }
      const name = params['name'];
      if (name != null) {
        this.setControlFieldValue('firstName', this.utilService.getFirstName(name));
        this.setControlFieldValue('lastName', this.utilService.getLastName(name));
      } else {
        this.setControlFieldValue('firstName', params['firstName']);
        this.setControlFieldValue('lastName', params['lastName']);
      }
    });

    this.createStudentAccountFormGroup.controls['birthMonth'].valueChanges.subscribe((value) => {
      this.setBirthDayOptions();
    });
    this.createStudentAccountFormGroup.controls['firstName'].markAsTouched();
    this.createStudentAccountFormGroup.controls['lastName'].markAsTouched();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  isUsingGoogleId() {
    return this.studentUser.googleUserId != null;
  }

  async createAccount() {
    if (this.createStudentAccountFormGroup.valid) {
      this.processing = true;
      await this.populateStudentUser();
      this.studentService.registerStudentAccount(this.studentUser).subscribe(
        (response: any) => {
          this.createAccountSuccess(response);
        },
        (response: HttpErrorResponse) => {
          this.createAccountError(response.error);
        }
      );
    }
  }

  createAccountSuccess(response: any): void {
    this.router.navigate([
      'join/student/complete',
      { username: response.username, isUsingGoogleId: this.isUsingGoogleId() }
    ]);
    this.processing = false;
  }

  createAccountError(error: any): void {
    const formError: any = {};
    switch (error.messageCode) {
      case 'invalidPasswordLength':
        console.log('pass len');
        formError.minlength = true;
        this.passwordsFormGroup
          .get(NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME)
          .setErrors(formError);
        break;
      case 'invalidPasswordPattern':
        console.log('pass pattern');
        formError.pattern = true;
        this.passwordsFormGroup
          .get(NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME)
          .setErrors(formError);
        break;
      case 'recaptchaResponseInvalid':
        console.log('recaptcha');
        this.studentUser['isRecaptchaInvalid'] = true;
        break;
      default:
        this.snackBar.open(this.translateCreateAccountErrorMessageCode(error.messageCode));
    }
    this.processing = false;
  }

  async populateStudentUser() {
    for (let key of Object.keys(this.createStudentAccountFormGroup.controls)) {
      if (key == 'birthMonth' || key == 'birthDay') {
        this.studentUser[key] = parseInt(this.createStudentAccountFormGroup.get(key).value);
      } else {
        this.studentUser[key] = this.createStudentAccountFormGroup.get(key).value;
      }
    }
    const token = await this.recaptchaV3Service.execute('importantAction').toPromise();
    this.studentUser['token'] = token;
    if (!this.isUsingGoogleId()) {
      this.studentUser['password'] = this.getPassword();
      delete this.studentUser['passwords'];
      delete this.studentUser['googleUserId'];
    }
  }

  getPassword() {
    return this.passwordsFormGroup.controls[
      NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME
    ].value;
  }

  setControlFieldValue(name: string, value: string) {
    this.createStudentAccountFormGroup.controls[name].setValue(value);
  }

  setBirthDayOptions() {
    const month = this.createStudentAccountFormGroup.get('birthMonth').value;
    let days = 0;
    switch (month) {
      case '2':
        days = 29;
        break;
      case '4':
      case '6':
      case '9':
      case '11':
        days = 30;
        break;
      default:
        days = 31;
    }
    this.days = [];
    for (let i = 0; i < days; i++) {
      let day = (i + 1).toString();
      if (i < 9) {
        day = '0' + day;
      }
      this.days.push(day);
    }
    if (days < this.createStudentAccountFormGroup.get('birthDay').value) {
      this.createStudentAccountFormGroup.controls['birthDay'].reset();
    }
    this.createStudentAccountFormGroup.controls['birthDay'].enable();
  }

  // public executeImportantAction(): void {
  //   this.recaptchaV3Service.execute('importantAction').subscribe((token) => {
  //     console.log(token);
  //   });
  // }
}
