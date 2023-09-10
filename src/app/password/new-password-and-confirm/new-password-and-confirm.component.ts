import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

@Component({
  selector: 'new-password-and-confirm',
  templateUrl: './new-password-and-confirm.component.html',
  styleUrls: ['./new-password-and-confirm.component.scss']
})
export class NewPasswordAndConfirmComponent implements OnInit {
  static readonly CONFIRM_NEW_PASSWORD_FORM_CONTROL_NAME: string = 'confirmNewPassword';
  static readonly NEW_PASSWORD_FORM_CONTROL_NAME: string = 'newPassword';

  LENGTH_REQUIREMENT_TEXT: string = $localize`be at least 8 characters long`;
  LETTER_REQUIREMENT_TEXT: string = $localize`include a letter`;
  NUMBER_REQUIREMENT_TEXT: string = $localize`include a number`;
  PASSWORD_MIN_LENGTH: number = 8;
  SYMBOL_REQUIREMENT_TEXT: string = $localize`include one of these symbols ! @ # $ % ^ & *`;

  protected confirmNewPasswordFormControl: FormControl;
  protected confirmNewPasswordFormControlName: string =
    NewPasswordAndConfirmComponent.CONFIRM_NEW_PASSWORD_FORM_CONTROL_NAME;
  @Input() confirmPasswordLabel: string = $localize`Confirm New Password`;
  @Input() formGroup: FormGroup;
  protected newPasswordFormControl: FormControl;
  protected newPasswordFormControlName: string =
    NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME;
  @Input() passwordLabel: string = $localize`New Password`;
  protected passwordStrength: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.newPasswordFormControl = new FormControl('', [
      Validators.required,
      this.createPasswordStrengthValidator()
    ]);
    this.formGroup.addControl(this.newPasswordFormControlName, this.newPasswordFormControl);
    this.confirmNewPasswordFormControl = new FormControl('', [Validators.required]);
    this.formGroup.addControl(
      this.confirmNewPasswordFormControlName,
      this.confirmNewPasswordFormControl
    );
    this.formGroup.addValidators(this.passwordMatchValidator);
  }

  private createPasswordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value ? control.value : '';
      const hasLetter = /[a-zA-Z]+/.test(value);
      const hasNumber = /[0-9]+/.test(value);
      const hasSymbol = /[!@#$%^&*]+/.test(value);
      const appropriateLength = value.length >= this.PASSWORD_MIN_LENGTH;
      const passwordValid = hasLetter && hasNumber && hasSymbol && appropriateLength;
      return !passwordValid
        ? {
            missingLetter: !hasLetter,
            missingNumber: !hasNumber,
            missingSymbol: !hasSymbol,
            tooShort: !appropriateLength
          }
        : null;
    };
  }

  private passwordMatchValidator(formGroup: FormGroup): ValidationErrors {
    const password = formGroup.get(NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME)
      .value;
    const confirmPassword = formGroup.get(
      NewPasswordAndConfirmComponent.CONFIRM_NEW_PASSWORD_FORM_CONTROL_NAME
    ).value;
    const error = password === confirmPassword ? null : { passwordDoesNotMatch: true };
    formGroup.controls[
      NewPasswordAndConfirmComponent.CONFIRM_NEW_PASSWORD_FORM_CONTROL_NAME
    ].setErrors(error);
    return error;
  }

  protected passwordStrengthChange(value: number): void {
    this.passwordStrength = value ? value : 0;
  }
}
