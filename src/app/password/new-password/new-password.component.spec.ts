import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getFormControl, hasError, setFormControlValue } from '../password-test-helper';
import { NewPasswordComponent } from './new-password.component';

let component: NewPasswordComponent;
let fixture: ComponentFixture<NewPasswordComponent>;

describe('NewPasswordComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPasswordComponent],
      imports: [BrowserAnimationsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPasswordComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    fixture.detectChanges();
  });

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
});

function setPasswordAndExpectError(password: string, errorName: string): void {
  setNewPasswordValue(password);
  expect(newPasswordHasError(errorName)).toBeTrue();
}

function setNewPasswordValue(value: string): void {
  setFormControlValue(component, NewPasswordComponent.FORM_CONTROL_NAME, value);
}

function newPasswordHasError(errorName: string): boolean {
  return hasError(component, NewPasswordComponent.FORM_CONTROL_NAME, errorName);
}

function getNewPasswordFormControl(): AbstractControl {
  return getFormControl(component, NewPasswordComponent.FORM_CONTROL_NAME);
}
