import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewPasswordAndConfirmComponent } from './new-password-and-confirm.component';

let component: NewPasswordAndConfirmComponent;
let fixture: ComponentFixture<NewPasswordAndConfirmComponent>;

describe('NewPasswordAndConfirmComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPasswordAndConfirmComponent],
      imports: [BrowserAnimationsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPasswordAndConfirmComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    fixture.detectChanges();
  });
  passwordValidation();
  confirmPasswordValidation();
});

function passwordValidation() {
  it('should show password required error', () => {
    setPasswordAndExpectError('', 'required');
  });

  it('should show password length error', () => {
    setPasswordAndExpectError('1234567', 'minlength');
  });

  it('should show password pattern error', () => {
    setPasswordAndExpectError('1234567', 'pattern');
  });

  it('should not show any error when password is valid', () => {
    setNewPasswordValue('Abcd1234');
    expect(getNewPasswordFormControl().errors).toBeNull();
  });
}

function setPasswordAndExpectError(password: string, errorName: string): void {
  setNewPasswordValue(password);
  expect(newPasswordHasError(errorName)).toBeTrue();
}

function setNewPasswordValue(value: string): void {
  setFormControlValue(
    component,
    NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME,
    value
  );
}

function newPasswordHasError(errorName: string): boolean {
  return hasError(
    component,
    NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME,
    errorName
  );
}

function getNewPasswordFormControl(): AbstractControl {
  return getFormControl(component, NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME);
}

function confirmPasswordValidation() {
  it('should show password does not match error', () => {
    setNewPasswordValue('a');
    setConfirmNewPasswordValue('b');
    component.formGroup.markAsTouched();
    expect(confirmNewPasswordHasError('passwordDoesNotMatch')).toBeTrue();
  });

  it('should not show any error when passwords match', () => {
    setNewPasswordValue('a');
    setConfirmNewPasswordValue('a');
    expect(getConfirmNewPasswordFormControl().errors).toBeNull();
  });
}

function setConfirmNewPasswordValue(value: string): void {
  setFormControlValue(
    component,
    NewPasswordAndConfirmComponent.CONFIRM_NEW_PASSWORD_FORM_CONTROL_NAME,
    value
  );
}

function confirmNewPasswordHasError(errorName: string): boolean {
  return hasError(
    component,
    NewPasswordAndConfirmComponent.CONFIRM_NEW_PASSWORD_FORM_CONTROL_NAME,
    errorName
  );
}

function getConfirmNewPasswordFormControl(): AbstractControl {
  return getFormControl(
    component,
    NewPasswordAndConfirmComponent.CONFIRM_NEW_PASSWORD_FORM_CONTROL_NAME
  );
}

function setFormControlValue(component: any, formControlName: string, value: string): void {
  getFormControl(component, formControlName).setValue(value);
}

function getFormControl(component: any, formControlName: string): AbstractControl {
  return component.formGroup.controls[formControlName];
}

function hasError(component: any, formControlName: string, errorName: string): boolean {
  return getFormControl(component, formControlName).hasError(errorName);
}
