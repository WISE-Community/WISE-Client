import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  static readonly FORM_CONTROL_NAME: string = 'newPassword';
  PASSWORD_MIN_LENGTH: number = 8;
  PASSWORD_PATTERN: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$';

  formControl: FormControl;
  formControlName: string = NewPasswordComponent.FORM_CONTROL_NAME;
  @Input() formGroup: FormGroup;
  @Input() label: string;

  constructor() {}

  ngOnInit(): void {
    this.formControl = new FormControl('', [
      Validators.required,
      Validators.minLength(this.PASSWORD_MIN_LENGTH),
      Validators.pattern(this.PASSWORD_PATTERN)
    ]);
    this.formGroup.addControl(this.formControlName, this.formControl);
  }
}
