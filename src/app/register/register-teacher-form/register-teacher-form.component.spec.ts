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
import { PasswordModule } from '../../password/password.module';

class MockTeacherService {
  registerTeacherAccount() {}
}

class MockUserService {}

let component: RegisterTeacherFormComponent;
let fixture: ComponentFixture<RegisterTeacherFormComponent>;
const PASSWORD: string = 'Abcd1234';
let teacherService: TeacherService;
let router: Router;
let snackBar: MatSnackBar;

describe('RegisterTeacherFormComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RegisterTeacherFormComponent],
        imports: [
          BrowserAnimationsModule,
          RouterTestingModule,
          ReactiveFormsModule,
          MatCheckboxModule,
          MatSelectModule,
          MatInputModule,
          MatSnackBarModule,
          PasswordModule
        ],
        providers: [
          { provide: TeacherService, useClass: MockTeacherService },
          { provide: UserService, useClass: MockUserService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterTeacherFormComponent);
    component = fixture.componentInstance;
    teacherService = TestBed.get(TeacherService);
    router = TestBed.get(Router);
    snackBar = TestBed.get(MatSnackBar);
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
function createAccount() {
  describe('createAccount()', () => {
    it('should create account with valid form fields', () => {
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
      spyOn(teacherService, 'registerTeacherAccount').and.returnValue(of(response));
      const routerNavigateSpy = spyOn(router, 'navigate').and.callFake(
        (args: any[]): Promise<boolean> => {
          return of(true).toPromise();
        }
      );
      component.createAccount();
      expect(routerNavigateSpy).toHaveBeenCalledWith([
        'join/teacher/complete',
        { username: username, isUsingGoogleId: false }
      ]);
    });

    it('should show error when invalid first name is sent to server', () => {
      expectCreateAccountWithInvalidNameToShowError(
        'invalidFirstName',
        'Error: First Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash'
      );
    });

    it('should show error when invalid last name is sent to server', () => {
      expectCreateAccountWithInvalidNameToShowError(
        'invalidLastName',
        'Error: Last Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash'
      );
    });

    it('should show error when invalid first and last name is sent to server', () => {
      expectCreateAccountWithInvalidNameToShowError(
        'invalidFirstAndLastName',
        'Error: First Name and Last Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash'
      );
    });
  });
}

function expectCreateAccountWithInvalidNameToShowError(errorCode: string, errorMessage: string) {
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
  spyOn(teacherService, 'registerTeacherAccount').and.returnValue(throwError(response));
  const snackBarSpy = spyOn(snackBar, 'open');
  component.createAccount();
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
