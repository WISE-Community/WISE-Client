import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterStudentFormComponent } from './register-student-form.component';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { StudentService } from '../../student/student.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as helpers from '../register-user-form/register-user-form-spec-helpers';
import {
  nameTests,
  validateAndExpect
} from '../register-user-form/register-user-form-spec-helpers';
import { By } from '@angular/platform-browser';
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
let routeParams: BehaviorSubject<any>;

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

function configureTestingModule(params: any = {}) {
  routeParams = new BehaviorSubject(params);
  TestBed.configureTestingModule({
    imports: [PasswordModule, RecaptchaV3Module, RegisterStudentFormComponent],
    providers: [
      { provide: ConfigService, useClass: MockConfigService },
      provideRouter([]),
      { provide: ActivatedRoute, useValue: { params: routeParams.asObservable() } },
      { provide: RECAPTCHA_V3_SITE_KEY, useValue: '' },
      { provide: StudentService, useClass: MockStudentService },
      { provide: UserService, useClass: MockUserService }
    ]
  });
}

describe('RegisterStudentFormComponent', () => {
  beforeEach(waitForAsync(() => {
    configureTestingModule();
    TestBed.compileComponents();
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
  validateWithoutBirthday();
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

function validateWithoutBirthday() {
  describe('validateWithoutBirthday()', () => {
    it('should be valid without birthday values', () => {
      component.createStudentAccountFormGroup.patchValue({
        firstName: 'Patrick',
        lastName: 'Star',
        gender: 'MALE',
        securityQuestion: 'question',
        securityQuestionAnswer: 'answer',
        passwords: {
          newPassword: PASSWORD,
          confirmNewPassword: PASSWORD
        }
      });

      expect(component.createStudentAccountFormGroup.valid).toBeTrue();
      expect(component.createStudentAccountFormGroup.contains('birthMonth')).toBeFalse();
      expect(component.createStudentAccountFormGroup.contains('birthDay')).toBeFalse();
      expect(fixture.nativeElement.textContent).not.toContain('Birthday');
    });
  });
}

function createAccount() {
  describe('createAccount()', () => {
    it('should create account with valid form fields', waitForAsync(async () => {
      component.createStudentAccountFormGroup.setValue(
        createAccountFormValue(
          'Patrick',
          'Star',
          'Male',
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
      const studentPayload = (
        studentService.registerStudentAccount as jasmine.Spy
      ).calls.mostRecent().args[0];
      expect('birthMonth' in studentPayload).toBeFalse();
      expect('birthDay' in studentPayload).toBeFalse();
    }));

    it('should create an account with a social sign-up payload without birthday values', async () => {
      TestBed.resetTestingModule();
      configureTestingModule({ gID: 'google-user-id' });
      fixture = TestBed.createComponent(RegisterStudentFormComponent);
      component = fixture.componentInstance;
      studentService = TestBed.inject(StudentService);
      fixture.detectChanges();
      component.createStudentAccountFormGroup.setValue({
        firstName: 'Patrick',
        lastName: 'Star',
        gender: 'MALE'
      });
      spyOn(studentService, 'registerStudentAccount').and.returnValue(
        of(helpers.createAccountSuccessResponse('PatrickS'))
      );

      await component.createAccount();

      const studentPayload = (
        studentService.registerStudentAccount as jasmine.Spy
      ).calls.mostRecent().args[0];
      expect('birthMonth' in studentPayload).toBeFalse();
      expect('birthDay' in studentPayload).toBeFalse();
      expect(studentPayload.googleUserId).toBe('google-user-id');
    });

    it('should show an error when Recaptcha is invalid', async () => {
      component.isRecaptchaEnabled = true;
      component.createStudentAccountFormGroup.setValue(
        createAccountFormValue(
          'Patrick',
          'Star',
          'Male',
          'Who lives in a pineapple under the sea?',
          'Spongebob Squarepants',
          PASSWORD,
          PASSWORD
        )
      );
      component.user.isRecaptchaInvalid = true;
      spyOn(recaptchaV3Service, 'execute').and.returnValue(of(''));
      const response: any = helpers.createAccountErrorResponse('recaptchaResponseInvalid');
      spyOn(studentService, 'registerStudentAccount').and.returnValue(throwError(() => response));

      await component.createAccount();
      fixture.detectChanges();

      const recaptchaError = fixture.debugElement.queryAll(By.css('.recaptchaError'));
      expect(recaptchaError).not.toHaveSize(0);
    });

    it('should show error when invalid first name is sent to server', async () => {
      await expectCreateAccountWithInvalidNameToShowError(
        'invalidFirstName',
        'Error: First Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash'
      );
    });

    it('should show error when invalid last name is sent to server', async () => {
      await expectCreateAccountWithInvalidNameToShowError(
        'invalidLastName',
        'Error: Last Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash'
      );
    });

    it('should show error when invalid first and last name is sent to server', async () => {
      await expectCreateAccountWithInvalidNameToShowError(
        'invalidFirstAndLastName',
        'Error: First Name and Last Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash'
      );
    });
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
  securityQuestion: string,
  securityQuestionAnswer: string,
  password: string,
  confirmPassword: string
) {
  return {
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    securityQuestion: securityQuestion,
    securityQuestionAnswer: securityQuestionAnswer,
    passwords: {
      newPassword: password,
      confirmNewPassword: confirmPassword
    }
  };
}
