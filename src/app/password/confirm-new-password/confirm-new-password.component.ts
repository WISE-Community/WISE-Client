import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewPasswordComponent } from '../new-password/new-password.component';

@Component({
  selector: 'confirm-new-password',
  templateUrl: './confirm-new-password.component.html',
  styleUrls: ['./confirm-new-password.component.scss']
})
export class ConfirmNewPasswordComponent implements OnInit {
  static readonly FORM_CONTROL_NAME = 'confirmNewPassword';

  formControl: FormControl;
  formControlName: string = ConfirmNewPasswordComponent.FORM_CONTROL_NAME;
  @Input() formGroup: FormGroup;
  @Input() label: string;

  constructor() {}

  ngOnInit(): void {
    this.formControl = new FormControl('', [Validators.required]);
    this.formGroup.addControl(this.formControlName, this.formControl);
    this.formGroup.addValidators(this.passwordMatchValidator);
  }

  passwordMatchValidator(passwordsFormGroup: FormGroup) {
    const password = passwordsFormGroup.get(NewPasswordComponent.FORM_CONTROL_NAME).value;
    const confirmPassword = passwordsFormGroup.get(ConfirmNewPasswordComponent.FORM_CONTROL_NAME)
      .value;
    if (password == confirmPassword) {
      return null;
    } else {
      const error = { passwordDoesNotMatch: true };
      passwordsFormGroup.controls[ConfirmNewPasswordComponent.FORM_CONTROL_NAME].setErrors(error);
      return error;
    }
  }
}
