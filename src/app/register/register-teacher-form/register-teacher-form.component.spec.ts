import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterTeacherFormComponent } from './register-teacher-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TeacherService } from '../../teacher/teacher.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from '../../services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import * as helpers from '../register-user-form/register-user-form-spec-helpers';
import {
  nameTests,
  validateAndExpect
} from '../register-user-form/register-user-form-spec-helpers';
import { By } from '@angular/platform-browser';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { PasswordModule } from '../../password/password.module';
import { ConfigService } from '../../services/config.service';
import { PasswordRequirementComponent } from '../../password/password-requirement/password-requirement.component';

class MockTeacherService {
  registerTeacherAccount() {}
}

class MockUserService {}

class MockConfigService {
  isRecaptchaEnabled() {}
}

let component: RegisterTeacherFormComponent;
let configService: ConfigService;
let fixture: ComponentFixture<RegisterTeacherFormComponent>;
const PASSWORD: string = PasswordRequirementComponent.VALID_PASSWORD;
let teacherService: TeacherService;
let recaptchaV3Service: ReCaptchaV3Service;
let router: Router;
let snackBar: MatSnackBar;

describe('RegisterTeacherFormComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RegisterTeacherFormComponent],
        imports: [
          BrowserAnimationsModule,
          MatCheckboxModule,
          MatInputModule,
          MatSelectModule,
          MatSnackBarModule,
          PasswordModule,
          ReactiveFormsModule,
          RecaptchaV3Module,
          RouterTestingModule
        ],
        providers: [
          { provide: ConfigService, useClass: MockConfigService },
          { provide: TeacherService, useClass: MockTeacherService },
          { provide: UserService, useClass: MockUserService },
          { provide: RECAPTCHA_V3_SITE_KEY, useValue: '' }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterTeacherFormComponent);
    component = fixture.componentInstance;
    configService = TestBed.inject(ConfigService);
    teacherService = TestBed.inject(TeacherService);
    recaptchaV3Service = TestBed.inject(ReCaptchaV3Service);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
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
          component.createTeacherAccountFormGroup.get('firstName'),
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
          component.createTeacherAccountFormGroup.get('lastName'),
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
        component.createTeacherAccountFormGroup.setValue(
          createAccountFormValue(
            'Spongebob',
            'Squarepants',
            'spongebob@bikinibottom.com',
            'Bikini Bottom',
            'Ocean',
            'Pacific Ocean',
            'Boating School',
            'Other',
            '',
            PASSWORD,
            PASSWORD,
            true
          )
        );
        const username = 'SpongebobSquarepants';
        const response: any = helpers.createAccountSuccessResponse(username);
        spyOn(recaptchaV3Service, 'execute').and.returnValue(of('token'));
        spyOn(teacherService, 'registerTeacherAccount').and.returnValue(of(response));
        const routerNavigateSpy = spyOn(router, 'navigate').and.callFake(
          (args: any[]): Promise<boolean> => {
            return of(true).toPromise();
          }
        );
        await component.createAccount();
        expect(routerNavigateSpy).toHaveBeenCalledWith([
          'join/teacher/complete',
          { username: username, isUsingGoogleId: false }
        ]);
      })
    );

    it('should show error when Recaptcha is invalid', () => {
      waitForAsync(async () => {
        component.isRecaptchaEnabled = true;
        component.createTeacherAccountFormGroup.setValue(
          createAccountFormValue(
            'Spongebob',
            'Squarepants',
            'spongebob@bikinibottom.com',
            'Bikini Bottom',
            'Ocean',
            'Pacific Ocean',
            'Boating School',
            'Other',
            '',
            PASSWORD,
            PASSWORD,
            true
          )
        );
        component.user.isRecaptchaInvalid = true;
        spyOn(recaptchaV3Service, 'execute').and.returnValue(of(''));
        const errorMessage = 'recaptchaResponseInvalid';
        const response: any = helpers.createAccountErrorResponse(errorMessage);
        spyOn(teacherService, 'registerTeacherAccount').and.returnValue(of(response));
        await component.createAccount();
        fixture.detectChanges();
        const recaptchaError = fixture.debugElement.queryAll(By.css('.recaptchaError'));
        expect(recaptchaError).not.toHaveSize(0);
      });
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
  component.createTeacherAccountFormGroup.setValue(
    createAccountFormValue(
      'Spongebob',
      'Squarepants',
      'spongebob@bikinibottom.com',
      'Bikini Bottom',
      'Ocean',
      'Pacific Ocean',
      'Boating School',
      'Other',
      '',
      PASSWORD,
      PASSWORD,
      true
    )
  );
  const response: any = helpers.createAccountErrorResponse(errorCode);
  spyOn(recaptchaV3Service, 'execute').and.returnValue(of('token'));
  spyOn(teacherService, 'registerTeacherAccount').and.returnValue(throwError(response));
  const snackBarSpy = spyOn(snackBar, 'open');
  await component.createAccount();
  expect(snackBarSpy).toHaveBeenCalledWith(errorMessage);
}

function createAccountFormValue(
  firstName: string,
  lastName: string,
  email: string,
  city: string,
  state: string,
  country: string,
  schoolName: string,
  schoolLevel: string,
  howDidYouHearAboutUs: string,
  password: string,
  confirmPassword: string,
  agree: boolean
) {
  return {
    firstName: firstName,
    lastName: lastName,
    email: email,
    city: city,
    state: state,
    country: country,
    schoolName: schoolName,
    schoolLevel: schoolLevel,
    howDidYouHearAboutUs: howDidYouHearAboutUs,
    passwords: {
      newPassword: password,
      confirmNewPassword: confirmPassword
    },
    agree: agree
  };
}
