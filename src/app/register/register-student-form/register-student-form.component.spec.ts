import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterStudentFormComponent } from './register-student-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of, throwError } from 'rxjs';
import { StudentService } from '../../student/student.service';
import { UserService } from '../../services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import * as helpers from '../register-user-form/register-user-form-spec-helpers';
import {
  nameTests,
  validateAndExpect
} from '../register-user-form/register-user-form-spec-helpers';
import { BrowserModule, By } from '@angular/platform-browser';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha-2';
import { PasswordModule } from '../../password/password.module';
import { ConfigService } from '../../services/config.service';
import { PasswordRequirementComponent } from '../../password/password-requirement/password-requirement.component';

let router: Router;
let component: RegisterStudentFormComponent;
let configService: ConfigService;
let fixture: ComponentFixture<RegisterStudentFormComponent>;
const PASSWORD: string = PasswordRequirementComponent.VALID_PASSWORD;
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

class MockConfigService {
  isRecaptchaEnabled() {}
}

describe('RegisterStudentFormComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterStudentFormComponent],
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        MatInputModule,
        MatSelectModule,
        MatSnackBarModule,
        PasswordModule,
        ReactiveFormsModule,
        RecaptchaV3Module
      ],
      providers: [
        { provide: ConfigService, useClass: MockConfigService },
        provideRouter([]),
        { provide: RECAPTCHA_V3_SITE_KEY, useValue: '' },
        { provide: StudentService, useClass: MockStudentService },

        { provide: UserService, useClass: MockUserService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    configService = TestBed.inject(ConfigService);
    fixture = TestBed.createComponent(RegisterStudentFormComponent);
    studentService = TestBed.inject(StudentService);
    recaptchaV3Service = TestBed.inject(ReCaptchaV3Service);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
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
  xdescribe('createAccount()', () => {
    it('should create account with valid form fields', waitForAsync(async () => {
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
      const routerNavigateSpy = spyOn(router, 'navigate');
      await component.createAccount();
      expect(routerNavigateSpy).toHaveBeenCalledWith([
        'join/student/complete',
        { username: username, isUsingGoogleId: false, isUsingMicrosoftId: false }
      ]);
    }));

    it('should show error when Recaptcha is invalid', () => {
      waitForAsync(async () => {
        component.isRecaptchaEnabled = true;
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
        component.user.isRecaptchaInvalid = true;
        spyOn(recaptchaV3Service, 'execute').and.returnValue(of(''));
        const errorMessage = 'recaptchaResponseInvalid';
        const response: any = helpers.createAccountErrorResponse(errorMessage);
        spyOn(studentService, 'registerStudentAccount').and.returnValue(of(response));
        component.createAccount();
        fixture.detectChanges();
        const recaptchaError = fixture.debugElement.queryAll(By.css('.recaptchaError'));
        expect(recaptchaError).not.toHaveSize(0);
      });
    });

    it('should show error when invalid first name is sent to server', waitForAsync(() => {
      expectCreateAccountWithInvalidNameToShowError(
        'invalidFirstName',
        'Error: First Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash'
      );
    }));

    it('should show error when invalid last name is sent to server', waitForAsync(() => {
      expectCreateAccountWithInvalidNameToShowError(
        'invalidLastName',
        'Error: Last Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash'
      );
    }));

    it('should show error when invalid first and last name is sent to server', waitForAsync(() => {
      expectCreateAccountWithInvalidNameToShowError(
        'invalidFirstAndLastName',
        'Error: First Name and Last Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash'
      );
    }));
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
  spyOn(studentService, 'registerStudentAccount').and.returnValue(throwError(() => response));
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
      newPassword: password,
      confirmNewPassword: confirmPassword
    }
  };
}
