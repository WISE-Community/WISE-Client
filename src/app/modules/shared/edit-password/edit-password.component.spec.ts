import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPasswordComponent } from './edit-password.component';
import { UserService } from '../../../services/user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { User } from '../../../domain/user';
import { MatDialogModule } from '@angular/material/dialog';
import { PasswordService } from '../../../services/password.service';
const CORRECT_OLD_PASS = 'a';
const INCORRECT_OLD_PASS = 'b';
const INVALID_PASSWORD_TOO_SHORT = 'Abcd123';
const INVALID_PASSWORD_PATTERN = 'abcd1234';
const NEW_PASSWORD_1 = 'Abcd1111';
const NEW_PASSWORD_2 = 'Abcd2222';

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

  changePassword(username, oldPassword, newPassword) {
    if (oldPassword === CORRECT_OLD_PASS) {
      return new Observable((observer) => {
        observer.next({ status: 'success', messageCode: 'passwordChanged' });
        observer.complete();
      });
    } else {
      return new Observable((observer) => {
        observer.next({ status: 'error', messageCode: 'incorrectPassword' });
        observer.complete();
      });
    }
  }
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
      imports: [BrowserAnimationsModule, ReactiveFormsModule, MatSnackBarModule, MatDialogModule],
      providers: [PasswordService, { provide: UserService, useValue: new MockUserService() }],
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
  formSubmit_disableSubmitButton();
  passwordChanged_handleResponse();
  incorrectPassword_showError();
  notGoogleUser_showUnlinkOption();
  unlinkGoogleButtonClick_showDialog();
  invalidPasswordTooShort_showError();
  invalidPasswordPattern_showError();
});

function initialState_disableSubmitButton() {
  it('should disable submit button and invalidate form on initial state', () => {
    expect(component.changePasswordFormGroup.valid).toBeFalsy();
    expectSubmitButtonDisabled();
  });
}

function validForm_enableSubmitButton() {
  it('should enable submit button when form is valid', () => {
    setPasswords(CORRECT_OLD_PASS, NEW_PASSWORD_1, NEW_PASSWORD_1);
    expectSubmitButtonEnabled();
    expect(component.changePasswordFormGroup.valid).toBeTruthy();
  });
}

function passwordMismatch_disableSubmitButtonAndInvalidateForm() {
  it(`should disable submit button and invalidate form when new password and confirm new password
      fields do not match`, () => {
    setPasswords(CORRECT_OLD_PASS, NEW_PASSWORD_1, NEW_PASSWORD_2);
    expectSubmitButtonDisabled();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();
  });
}

function oldPasswordIncorrect_disableSubmitButtonAndShowError() {
  it(`should disable submit button and set incorrectPassword error when old password is
      incorrect`, async () => {
    setPasswords(INCORRECT_OLD_PASS, NEW_PASSWORD_1, NEW_PASSWORD_1);
    submitForm();
    expectSubmitButtonDisabled();
    expect(component.changePasswordFormGroup.get('oldPassword').getError('incorrectPassword')).toBe(
      true
    );
  });
}

function formSubmit_disableSubmitButton() {
  it('should disable submit button when form is successfully submitted', async () => {
    setPasswords(CORRECT_OLD_PASS, NEW_PASSWORD_1, NEW_PASSWORD_1);
    submitForm();
    expectSubmitButtonDisabled();
  });
}

function passwordChanged_handleResponse() {
  it(`should handle the change password response when the password was successfully
      changed`, () => {
    const resetFormSpy = spyOn(component, 'resetForm');
    const snackBarSpy = spyOn(component.snackBar, 'open');
    const response = {
      status: 'success',
      messageCode: 'passwordChanged'
    };
    component.handleChangePasswordResponse(response);
    expect(resetFormSpy).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
  });
}

function incorrectPassword_showError() {
  it('should handle the change password response when the password was incorrect', () => {
    const response = {
      status: 'error',
      messageCode: 'incorrectPassword'
    };
    component.handleChangePasswordResponse(response);
    expect(component.changePasswordFormGroup.get('oldPassword').getError('incorrectPassword')).toBe(
      true
    );
  });
}

function notGoogleUser_showUnlinkOption() {
  it('should hide show option to unlink google account if the user is not a google user', () => {
    expect(getUnlinkGoogleAccountButton()).toBeNull();
  });
}

function unlinkGoogleButtonClick_showDialog() {
  it('clicking on unlink google account link should open a dialog', () => {
    const dialogSpy = spyOn(component.dialog, 'open');
    setGoogleUser();
    getUnlinkGoogleAccountButton().click();
    expect(dialogSpy).toHaveBeenCalled();
  });
}

function invalidPasswordTooShort_showError() {
  it(`should disable submit button and set min length error when new password is too
      short`, async () => {
    setPasswords(CORRECT_OLD_PASS, INVALID_PASSWORD_TOO_SHORT, INVALID_PASSWORD_TOO_SHORT);
    expectSubmitButtonDisabled();
    expect(component.newPasswordFormGroup.get('newPassword').getError('minlength')).toBeTruthy();
    expect(component.newPasswordFormGroup.get('newPassword').getError('pattern')).toBeFalsy();
  });
}

function invalidPasswordPattern_showError() {
  it(`should disable submit button and set pattern error when new password does not satisfy the
      pattern requirements`, async () => {
    setPasswords(CORRECT_OLD_PASS, INVALID_PASSWORD_PATTERN, INVALID_PASSWORD_PATTERN);
    expectSubmitButtonDisabled();
    expect(component.newPasswordFormGroup.get('newPassword').getError('minlength')).toBeFalsy();
    expect(component.newPasswordFormGroup.get('newPassword').getError('pattern')).toBeTruthy();
  });
}

export function expectSubmitButtonDisabled() {
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
