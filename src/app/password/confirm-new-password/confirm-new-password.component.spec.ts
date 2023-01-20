import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewPasswordComponent } from '../new-password/new-password.component';
import { getFormControl, hasError, setFormControlValue } from '../password-test-helper';
import { ConfirmNewPasswordComponent } from './confirm-new-password.component';

let component: ConfirmNewPasswordComponent;
let fixture: ComponentFixture<ConfirmNewPasswordComponent>;

describe('ConfirmNewPasswordComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmNewPasswordComponent],
      imports: [BrowserAnimationsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmNewPasswordComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    component.formGroup.addControl(
      NewPasswordComponent.FORM_CONTROL_NAME,
      new FormControl('', [Validators.required])
    );
    fixture.detectChanges();
  });

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
});

function setNewPasswordValue(value: string): void {
  setFormControlValue(component, NewPasswordComponent.FORM_CONTROL_NAME, value);
}

function setConfirmNewPasswordValue(value: string): void {
  setFormControlValue(component, ConfirmNewPasswordComponent.FORM_CONTROL_NAME, value);
}

function confirmNewPasswordHasError(errorName: string): boolean {
  return hasError(component, ConfirmNewPasswordComponent.FORM_CONTROL_NAME, errorName);
}

function getConfirmNewPasswordFormControl(): AbstractControl {
  return getFormControl(component, ConfirmNewPasswordComponent.FORM_CONTROL_NAME);
}
