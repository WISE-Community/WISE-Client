import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'new-password-and-confirm',
  templateUrl: './new-password-and-confirm.component.html',
  styleUrls: ['./new-password-and-confirm.component.scss']
})
export class NewPasswordAndConfirmComponent implements OnInit {
  static readonly CONFIRM_NEW_PASSWORD_FORM_CONTROL_NAME: string = 'confirmNewPassword';
  static readonly NEW_PASSWORD_FORM_CONTROL_NAME: string = 'newPassword';
  PASSWORD_MIN_LENGTH: number = 8;
  PASSWORD_PATTERN: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$';

  confirmNewPasswordFormControl: FormControl;
  confirmNewPasswordFormControlName: string =
    NewPasswordAndConfirmComponent.CONFIRM_NEW_PASSWORD_FORM_CONTROL_NAME;
  @Input() confirmPasswordLabel: string = $localize`Confirm New Password`;
  @Input() formGroup: FormGroup;
  newPasswordFormControl: FormControl;
  newPasswordFormControlName: string =
    NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME;
  @Input() passwordLabel: string = $localize`New Password`;

  constructor() {}

  ngOnInit(): void {
    this.newPasswordFormControl = new FormControl('', [
      Validators.required,
      Validators.minLength(this.PASSWORD_MIN_LENGTH),
      Validators.pattern(this.PASSWORD_PATTERN)
    ]);
    this.formGroup.addControl(this.newPasswordFormControlName, this.newPasswordFormControl);
    this.confirmNewPasswordFormControl = new FormControl('', [Validators.required]);
    this.formGroup.addControl(
      this.confirmNewPasswordFormControlName,
      this.confirmNewPasswordFormControl
    );
    this.formGroup.addValidators(this.passwordMatchValidator);
  }

  passwordMatchValidator(formGroup: FormGroup): ValidationErrors {
    const password = formGroup.get(NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME)
      .value;
    const confirmPassword = formGroup.get(
      NewPasswordAndConfirmComponent.CONFIRM_NEW_PASSWORD_FORM_CONTROL_NAME
    ).value;
    if (password == confirmPassword) {
      return null;
    } else {
      const error = { passwordDoesNotMatch: true };
      formGroup.controls[
        NewPasswordAndConfirmComponent.CONFIRM_NEW_PASSWORD_FORM_CONTROL_NAME
      ].setErrors(error);
      return error;
    }
  }
}
