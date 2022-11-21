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
import { PasswordService } from '../../services/password.service';

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
          MatSnackBarModule
        ],
        providers: [
          PasswordService,
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
  let firstNameField;
  beforeEach(() => {
    firstNameField = component.createTeacherAccountFormGroup.get('lastName');
  });
  describe('validation', () => {
    it('should validate last name when it contains lowercase letters', () => {
      firstNameField.setValue('smith');
      expect(firstNameField.getError('pattern')).toBeNull();
    });
    it('should validate last name when it contains lowercase letters and spaces', () => {
      firstNameField.setValue('smith star');
      expect(firstNameField.getError('pattern')).toBeNull();
    });
    it('should validate last name when it contains lowercase letters and dashes', () => {
      firstNameField.setValue('smith-star');
      expect(firstNameField.getError('pattern')).toBeNull();
    });
    it('should validate last name when it contains lowercase letters and spaces and dashes', () => {
      firstNameField.setValue('sam-smith star');
      expect(firstNameField.getError('pattern')).toBeNull();
    });
    it('should not validate last name when it contains symbols other than a dash', () => {
      firstNameField.setValue('smith@');
      expect(firstNameField.getError('pattern')).not.toBeNull();
    });
    it('should not validate last name when it begins with a space', () => {
      firstNameField.setValue(' smith');
      expect(firstNameField.getError('pattern')).not.toBeNull();
    });
    it('should not validate last name when it begins with a dash', () => {
      firstNameField.setValue('-smith');
      expect(firstNameField.getError('pattern')).not.toBeNull();
    });
    it('should not validate last name when it ends with a space', () => {
      firstNameField.setValue('smith ');
      expect(firstNameField.getError('pattern')).not.toBeNull();
    });
    it('should not validate last name when it ends with a dash', () => {
      firstNameField.setValue('smith-');
      expect(firstNameField.getError('pattern')).not.toBeNull();
    });
    it('should not validate last name when it begins and ends with a dash', () => {
      firstNameField.setValue('-smith-');
      expect(firstNameField.getError('pattern')).not.toBeNull();
    });
    it('should not validate last name when it begins and ends with a space', () => {
      firstNameField.setValue(' smith ');
      expect(firstNameField.getError('pattern')).not.toBeNull();
    });
  });
}

function validateLastName() {
  let lastNameField;
  beforeEach(() => {
    lastNameField = component.createTeacherAccountFormGroup.get('lastName');
  });
  describe('validation', () => {
    it('should validate last name when it contains lowercase letters', () => {
      lastNameField.setValue('smith');
      expect(lastNameField.getError('pattern')).toBeNull();
    });
    it('should validate last name when it contains lowercase letters and spaces', () => {
      lastNameField.setValue('smith star');
      expect(lastNameField.getError('pattern')).toBeNull();
    });
    it('should validate last name when it contains lowercase letters and dashes', () => {
      lastNameField.setValue('smith-star');
      expect(lastNameField.getError('pattern')).toBeNull();
    });
    it('should validate last name when it contains lowercase letters and spaces and dashes', () => {
      lastNameField.setValue('sam-smith star');
      expect(lastNameField.getError('pattern')).toBeNull();
    });
    it('should not validate last name when it contains symbols other than a dash', () => {
      lastNameField.setValue('smith@');
      expect(lastNameField.getError('pattern')).not.toBeNull();
    });
    it('should not validate last name when it begins with a space', () => {
      lastNameField.setValue(' smith');
      expect(lastNameField.getError('pattern')).not.toBeNull();
    });
    it('should not validate last name when it begins with a dash', () => {
      lastNameField.setValue('-smith');
      expect(lastNameField.getError('pattern')).not.toBeNull();
    });
    it('should not validate last name when it ends with a space', () => {
      lastNameField.setValue('smith ');
      expect(lastNameField.getError('pattern')).not.toBeNull();
    });
    it('should not validate last name when it ends with a dash', () => {
      lastNameField.setValue('smith-');
      expect(lastNameField.getError('pattern')).not.toBeNull();
    });
    it('should not validate last name when it begins and ends with a dash', () => {
      lastNameField.setValue('-smith-');
      expect(lastNameField.getError('pattern')).not.toBeNull();
    });
    it('should not validate last name when it begins and ends with a space', () => {
      lastNameField.setValue(' smith ');
      expect(lastNameField.getError('pattern')).not.toBeNull();
    });
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
        'Error: First Name must only contain characters A-Z'
      );
    });

    it('should show error when invalid last name is sent to server', () => {
      expectCreateAccountWithInvalidNameToShowError(
        'invalidLastName',
        'Error: Last Name must only contain characters A-Z'
      );
    });

    it('should show error when invalid first and last name is sent to server', () => {
      expectCreateAccountWithInvalidNameToShowError(
        'invalidFirstAndLastName',
        'Error: First Name and Last Name must only contain characters A-Z'
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
      password: password,
      confirmPassword: confirmPassword
    },
    agree: agree
  };
}
