import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterStudentFormComponent } from './register-student-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, throwError } from 'rxjs';
import { StudentService } from '../../student/student.service';
import { UserService } from '../../services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import * as helpers from '../register-user-form/register-user-form-spec-helpers';
import { PasswordService } from '../../services/password.service';
import {
  nameTests,
  validateAndExpect
} from '../register-user-form/register-user-form-spec-helpers';
import { BrowserModule, By } from '@angular/platform-browser';
import { MatError } from '@angular/material/form-field';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

let router: Router;
let component: RegisterStudentFormComponent;
let fixture: ComponentFixture<RegisterStudentFormComponent>;
const PASSWORD: string = 'Abcd1234';
let recaptchaV3Service: ReCaptchaV3Service;
let studentService: StudentService;
let snackBar: MatSnackBar;

export class MockStudentService {
  registerStudentAccount() {}

  retrieveSecurityQuestions() {
    return Observable.create((observer) => {
      observer.next([]);
      observer.complete();
    });
  }
}

export class MockUserService {}

describe('RegisterStudentFormComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RegisterStudentFormComponent],
        imports: [
          BrowserAnimationsModule,
          RouterTestingModule,
          ReactiveFormsModule,
          MatSelectModule,
          MatInputModule,
          MatSnackBarModule,
          BrowserModule,
          RecaptchaV3Module
        ],
        providers: [
          PasswordService,
          { provide: StudentService, useClass: MockStudentService },
          { provide: UserService, useClass: MockUserService },
          { provide: RECAPTCHA_V3_SITE_KEY, useValue: '' }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterStudentFormComponent);
    studentService = TestBed.get(StudentService);
    router = TestBed.get(Router);
    snackBar = TestBed.inject(MatSnackBar);
    recaptchaV3Service = TestBed.inject(ReCaptchaV3Service);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  validateFirstName();
  validateLastName();
  createAccount();
});

function validateFirstName() {
  describe('validateFirstName()', () => {
    for (const nameTest of nameTests) {
      it(nameTest.description, () => {
        validateAndExpect(
          component.createStudentAccountFormGroup.get('firstName'),
          nameTest.name,
          nameTest.isValid
        );
      });
    }
  });
}

function validateLastName() {
  describe('validateLastName()', () => {
    for (const nameTest of nameTests) {
      it(nameTest.description, () => {
        validateAndExpect(
          component.createStudentAccountFormGroup.get('lastName'),
          nameTest.name,
          nameTest.isValid
        );
      });
    }
  });
}

async function createAccount() {
  describe('createAccount()', () => {
    it(
      'should create account with valid form fields',
      waitForAsync(async () => {
        component.createStudentAccountFormGroup.setValue(
          createAccountFormValue(
            'Patrick',
            'Star',
            'Male',
            '01',
            '01',
            'Who lives in a pineapple under the sea?',
            'Spongebob Squarepants',
            PASSWORD,
            PASSWORD
          )
        );
        const username = 'PatrickS0101';
        const response: any = helpers.createAccountSuccessResponse(username);
        spyOn(recaptchaV3Service, 'execute').and.returnValue(of('token'));
        spyOn(studentService, 'registerStudentAccount').and.returnValue(of(response));
        const routerNavigateSpy = spyOn(router, 'navigate').and.callFake(
          (args: any[]): Promise<boolean> => {
            return of(true).toPromise();
          }
        );
        await component.createAccount();
        expect(routerNavigateSpy).toHaveBeenCalledWith([
          'join/student/complete',
          { username: username, isUsingGoogleId: false }
        ]);
      })
    );

    it('should show error when Recaptcha is invalid', () => {
      component.createStudentAccountFormGroup.setValue(
        createAccountFormValue(
          'Patrick',
          'Star',
          'Male',
          '01',
          '01',
          'Who lives in a pineapple under the sea?',
          'Spongebob Squarepants',
          PASSWORD,
          PASSWORD
        )
      );
      component.studentUser.isRecaptchaInvalid = true;
      const errorMessage = 'recaptchaResponseInvalid';
      const response: any = helpers.createAccountErrorResponse(errorMessage);
      spyOn(studentService, 'registerStudentAccount').and.returnValue(throwError(response));
      const recaptchaError = fixture.debugElement.queryAll(By.css('.recaptchaError'));
      console.log(recaptchaError);
    });

    it(
      'should show error when invalid first name is sent to server',
      waitForAsync(() => {
        expectCreateAccountWithInvalidNameToShowError(
          'invalidFirstName',
          'Error: First Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash'
        );
      })
    );

    it(
      'should show error when invalid last name is sent to server',
      waitForAsync(() => {
        expectCreateAccountWithInvalidNameToShowError(
          'invalidLastName',
          'Error: Last Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash'
        );
      })
    );

    it(
      'should show error when invalid first and last name is sent to server',
      waitForAsync(() => {
        expectCreateAccountWithInvalidNameToShowError(
          'invalidFirstAndLastName',
          'Error: First Name and Last Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash'
        );
      })
    );
  });
}

async function expectCreateAccountWithInvalidNameToShowError(
  errorCode: string,
  errorMessage: string
) {
  component.createStudentAccountFormGroup.setValue(
    createAccountFormValue(
      'Patrick',
      'Star',
      'Male',
      '01',
      '01',
      'Who lives in a pineapple under the sea?',
      'Spongebob Squarepants',
      PASSWORD,
      PASSWORD
    )
  );
  const response: any = helpers.createAccountErrorResponse(errorCode);
  spyOn(recaptchaV3Service, 'execute').and.returnValue(of('token'));
  spyOn(studentService, 'registerStudentAccount').and.returnValue(throwError(response));
  const snackBarSpy = spyOn(snackBar, 'open');
  await component.createAccount();
  expect(snackBarSpy).toHaveBeenCalledWith(errorMessage);
}

function createAccountFormValue(
  firstName: string,
  lastName: string,
  gender: string,
  birthMonth: string,
  birthDay: string,
  securityQuestion: string,
  securityQuestionAnswer: string,
  password: string,
  confirmPassword: string
) {
  return {
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    birthMonth: birthMonth,
    birthDay: birthDay,
    securityQuestion: securityQuestion,
    securityQuestionAnswer: securityQuestionAnswer,
    passwords: {
      password: password,
      confirmPassword: confirmPassword
    }
  };
}
