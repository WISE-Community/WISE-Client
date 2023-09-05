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
import { PasswordModule } from '../../../password/password.module';
import { MatIconModule } from '@angular/material/icon';
import { PasswordErrors } from '../../../domain/password/password-errors';

const CORRECT_OLD_PASSWORD = 'correctOldPassword123';
const INCORRECT_OLD_PASSWORD = 'incorrectOldPassword123';
const INVALID_PASSWORD_TOO_SHORT = 'abc123';
const INVALID_PASSWORD_PATTERN = 'abcd1234';
const NEW_PASSWORD_1 = 'abcd111!';
const NEW_PASSWORD_2 = 'abcd222!';

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
  invalidPasswordTooShort_showError();
  invalidPassword_showError();
});

function initialState_disableSubmitButton() {
  it('should disable submit button and invalidate form on initial state', () => {
    expect(component.changePasswordFormGroup.valid).toBeFalsy();
    expectSubmitButtonDisabled();
  });
}

function validForm_enableSubmitButton() {
  it('should enable submit button when form is valid', () => {
    setPasswords(CORRECT_OLD_PASSWORD, NEW_PASSWORD_1, NEW_PASSWORD_1);
    expectSubmitButtonEnabled();
    expect(component.changePasswordFormGroup.valid).toBeTruthy();
  });
}

function passwordMismatch_disableSubmitButtonAndInvalidateForm() {
  it(`should disable submit button and invalidate form when new password and confirm new password
      fields do not match`, () => {
    setPasswords(CORRECT_OLD_PASSWORD, NEW_PASSWORD_1, NEW_PASSWORD_2);
    expectSubmitButtonDisabled();
    expect(component.changePasswordFormGroup.valid).toBeFalsy();
  });
}

function oldPasswordIncorrect_disableSubmitButtonAndShowError() {
  it(`should disable submit button and set incorrectPassword error when old password is
      incorrect`, async () => {
    spyOn(TestBed.inject(UserService), 'changePassword').and.returnValue(
      generateObservableResponse('incorrectPassword', false)
    );
    setPasswords(INCORRECT_OLD_PASSWORD, NEW_PASSWORD_1, NEW_PASSWORD_1);
    submitForm();
    expectSubmitButtonDisabled();
    expect(component.changePasswordFormGroup.get('oldPassword').getError('incorrectPassword')).toBe(
      true
    );
  });
}

function saveChanges_newPasswordPatternInvalid_ShowError() {
  it(`should set pattern error when changePassword response returns new password is not valid
      pattern error`, async () => {
    const passwordErrors = new PasswordErrors(false, false, true, false);
    spyOn(TestBed.inject(UserService), 'changePassword').and.returnValue(
      generateObservableResponse(passwordErrors, false)
    );
    setPasswords(CORRECT_OLD_PASSWORD, INVALID_PASSWORD_PATTERN, INVALID_PASSWORD_PATTERN);
    component.saveChanges();
    expectPasswordErrors(false, false, true, false);
  });
}

function expectPasswordErrors(
  missingLetter: boolean,
  missingNumber: boolean,
  missingSymbol: boolean,
  tooShort: boolean
): void {
  expect(component.newPasswordFormGroup.get('newPassword').getError('missingLetter')).toBe(
    missingLetter
  );
  expect(component.newPasswordFormGroup.get('newPassword').getError('missingNumber')).toBe(
    missingNumber
  );
  expect(component.newPasswordFormGroup.get('newPassword').getError('missingSymbol')).toBe(
    missingSymbol
  );
  expect(component.newPasswordFormGroup.get('newPassword').getError('tooShort')).toBe(tooShort);
}

function formSubmit_disableSubmitButton() {
  it('should disable submit button when form is successfully submitted', async () => {
    spyOn(TestBed.inject(UserService), 'changePassword').and.returnValue(
      generateObservableResponse('passwordChanged', true)
    );
    setPasswords(CORRECT_OLD_PASSWORD, NEW_PASSWORD_1, NEW_PASSWORD_1);
    submitForm();
    expectSubmitButtonDisabled();
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
    setPasswords(CORRECT_OLD_PASSWORD, INVALID_PASSWORD_TOO_SHORT, INVALID_PASSWORD_TOO_SHORT);
    expectSubmitButtonDisabled();
    expect(component.newPasswordFormGroup.get('newPassword').errors.tooShort).toBeTrue();
  });
}

function invalidPassword_showError() {
  it(`should disable submit button and set password error when new password does not satisfy the
      requirements`, async () => {
    setPasswords(CORRECT_OLD_PASSWORD, INVALID_PASSWORD_PATTERN, INVALID_PASSWORD_PATTERN);
    expectSubmitButtonDisabled();
    expect(component.newPasswordFormGroup.get('newPassword').errors).not.toBeNull();
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

function generateObservableResponse(arg: string | any, isSuccess: boolean): Observable<any> {
  return isSuccess ? generateSuccessObservable(arg) : generateErrorObservable(arg);
}

function generateSuccessObservable(arg: string | any): Observable<any> {
  return new Observable((observer) => {
    observer.next(generateSuccessResponseValue(arg));
    observer.complete();
  });
}

function generateSuccessResponseValue(arg: string | any): any {
  return typeof arg === 'string' ? { messageCode: arg } : arg;
}

function generateErrorObservable(arg: string | any): Observable<any> {
  return new Observable((observer) => {
    observer.error(generateErrorResponseValue(arg));
    observer.complete();
  });
}

function generateErrorResponseValue(arg: string | any): any {
  return typeof arg === 'string' ? { error: { messageCode: arg } } : { error: arg };
}
