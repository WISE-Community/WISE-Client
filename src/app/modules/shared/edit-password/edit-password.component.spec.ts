import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPasswordComponent } from './edit-password.component';
import { UserService } from '../../../services/user.service';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { User } from '../../../domain/user';
import { MatDialogModule } from '@angular/material/dialog';
import { PasswordModule } from '../../../password/password.module';
import { MatIconModule } from '@angular/material/icon';
import { PasswordErrors } from '../../../domain/password/password-errors';
import { PasswordRequirementComponent } from '../../../password/password-requirement/password-requirement.component';

const CORRECT_OLD_PASSWORD = 'correctOldPassword123';
const INCORRECT_OLD_PASSWORD = 'incorrectOldPassword123';
const INVALID_PASSWORD = PasswordRequirementComponent.INVALID_PASSWORD_TOO_SHORT;
const NEW_PASSWORD_1 = PasswordRequirementComponent.VALID_PASSWORD;
const NEW_PASSWORD_2 = PasswordRequirementComponent.VALID_PASSWORD + '!';

export class MockUserService {
  getUser(): BehaviorSubject<User> {
    const user: User = new User();
    user.firstName = 'Demo';
    user.lastName = 'User';
    user.username = 'DemoUser';
    const userBehaviorSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
    userBehaviorSubject.next(user);
    return userBehaviorSubject;
  }

  changePassword(oldPassword: string, newPassword: string) {}
}

let component: EditPasswordComponent;
let fixture: ComponentFixture<EditPasswordComponent>;

const getSubmitButton = () => {
  return fixture.debugElement.nativeElement.querySelector('button[type="submit"]');
};

const getUnlinkGoogleAccountButton = () => {
  return fixture.debugElement.nativeElement.querySelector('button[id="unlinkGoogleAccount"]');
};

const getForm = () => {
  return fixture.debugElement.query(By.css('form'));
};

describe('EditPasswordComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPasswordComponent],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatIconModule,
        MatSnackBarModule,
        PasswordModule,
        ReactiveFormsModule
      ],
      providers: [{ provide: UserService, useValue: new MockUserService() }],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(EditPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  initialState_disableSubmitButton();
  validForm_enableSubmitButton();
  passwordMismatch_disableSubmitButtonAndInvalidateForm();
  oldPasswordIncorrect_disableSubmitButtonAndShowError();
  saveChanges_newPasswordPatternInvalid_ShowError();
  formSubmit_disableSubmitButton();
  notGoogleUser_showUnlinkOption();
  unlinkGoogleButtonClick_showDialog();
  invalidPassword_showError();
});

function initialState_disableSubmitButton() {
  describe('the form is first loaded', () => {
    it('disables the submit button', () => {
      expect(component.changePasswordFormGroup.valid).toBeFalsy();
      expectSubmitButtonDisabled();
    });
  });
}

function validForm_enableSubmitButton() {
  describe('the form is valid', () => {
    it('enables the submit button', () => {
      setPasswords(CORRECT_OLD_PASSWORD, NEW_PASSWORD_1, NEW_PASSWORD_1);
      expectSubmitButtonEnabled();
      expect(component.changePasswordFormGroup.valid).toBeTruthy();
    });
  });
}

function passwordMismatch_disableSubmitButtonAndInvalidateForm() {
  describe('new password and confirm new password do not match', () => {
    it(`disables the submit button`, () => {
      setPasswords(CORRECT_OLD_PASSWORD, NEW_PASSWORD_1, NEW_PASSWORD_2);
      expect(component.changePasswordFormGroup.valid).toBeFalsy();
      expectSubmitButtonDisabled();
    });
  });
}

function oldPasswordIncorrect_disableSubmitButtonAndShowError() {
  describe('server returns response that says old password is incorrect', () => {
    it('shows the incorrect password error and disables the submit button', async () => {
      spyOn(TestBed.inject(UserService), 'changePassword').and.returnValue(
        generateErrorObservable('incorrectPassword')
      );
      setPasswords(INCORRECT_OLD_PASSWORD, NEW_PASSWORD_1, NEW_PASSWORD_1);
      submitForm();
      expect(
        component.changePasswordFormGroup.get('oldPassword').getError('incorrectPassword')
      ).toBe(true);
      expectSubmitButtonDisabled();
    });
  });
}

function saveChanges_newPasswordPatternInvalid_ShowError() {
  describe('server returns response that says new password is not valid', () => {
    it('shows the new password error messages and disables the submit button', async () => {
      const passwordErrors = new PasswordErrors(false, false, true);
      spyOn(TestBed.inject(UserService), 'changePassword').and.returnValue(
        generateErrorObservable(passwordErrors)
      );
      setPasswords(CORRECT_OLD_PASSWORD, INVALID_PASSWORD, INVALID_PASSWORD);
      component.saveChanges();
      expectPasswordErrors(false, false, true);
      expectSubmitButtonDisabled();
    });
  });
}

function expectPasswordErrors(
  missingLetter: boolean,
  missingNumber: boolean,
  tooShort: boolean
): void {
  expect(component.newPasswordFormGroup.get('newPassword').getError('missingLetter')).toBe(
    missingLetter
  );
  expect(component.newPasswordFormGroup.get('newPassword').getError('missingNumber')).toBe(
    missingNumber
  );
  expect(component.newPasswordFormGroup.get('newPassword').getError('tooShort')).toBe(tooShort);
}

function formSubmit_disableSubmitButton() {
  describe('form is successfully submitted', () => {
    it('disables the submit button', async () => {
      spyOn(TestBed.inject(UserService), 'changePassword').and.returnValue(
        generateSuccessObservable('passwordChanged')
      );
      setPasswords(CORRECT_OLD_PASSWORD, NEW_PASSWORD_1, NEW_PASSWORD_1);
      submitForm();
      expectSubmitButtonDisabled();
    });
  });
}

function notGoogleUser_showUnlinkOption() {
  describe('user is not a google user', () => {
    it('hides the option to unlink google acccount', () => {
      expect(getUnlinkGoogleAccountButton()).toBeNull();
    });
  });
}

function unlinkGoogleButtonClick_showDialog() {
  describe('user is a google user and clicks unlink google account button', () => {
    it('opens dialog', () => {
      const dialogSpy = spyOn(component.dialog, 'open');
      setGoogleUser();
      getUnlinkGoogleAccountButton().click();
      expect(dialogSpy).toHaveBeenCalled();
    });
  });
}

function invalidPassword_showError() {
  describe('new password does not satisfy the requirements', () => {
    it('shows password errors and disables submit button', async () => {
      setPasswords(CORRECT_OLD_PASSWORD, INVALID_PASSWORD, INVALID_PASSWORD);
      expect(component.newPasswordFormGroup.get('newPassword').errors).not.toBeNull();
      expectSubmitButtonDisabled();
    });
  });
}

function expectSubmitButtonDisabled() {
  expect(getSubmitButton().disabled).toBe(true);
}

function expectSubmitButtonEnabled() {
  expect(getSubmitButton().disabled).toBe(false);
}

function submitForm() {
  getForm().triggerEventHandler('submit', null);
  fixture.detectChanges();
}

function setGoogleUser() {
  component.isGoogleUser = true;
  fixture.detectChanges();
}

function setPasswords(oldPass: string, newPass: string, newPassConfirm: string) {
  component.changePasswordFormGroup.get('oldPassword').setValue(oldPass);
  component.newPasswordFormGroup.get('newPassword').setValue(newPass);
  component.newPasswordFormGroup.get('confirmNewPassword').setValue(newPassConfirm);
  fixture.detectChanges();
}

function generateSuccessObservable(arg: string | any): Observable<void> {
  return generateResponseObservable(arg, true);
}

function generateSuccessResponseValue(arg: string | any): any {
  return typeof arg === 'string' ? { messageCode: arg } : arg;
}

function generateErrorObservable(arg: string | any): Observable<void> {
  return generateResponseObservable(arg, false);
}

function generateResponseObservable(arg: string | any, isSuccess: boolean): Observable<void> {
  return new Observable((observer: Subscriber<void>) => {
    isSuccess
      ? observer.next(generateSuccessResponseValue(arg))
      : observer.error(generateErrorResponseValue(arg));
    observer.complete();
  });
}

function generateErrorResponseValue(arg: string | any): any {
  return typeof arg === 'string' ? { error: { messageCode: arg } } : { error: arg };
}
