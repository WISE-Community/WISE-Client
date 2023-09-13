import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'password-requirement',
  templateUrl: './password-requirement.component.html',
  styleUrls: ['./password-requirement.component.scss']
})
export class PasswordRequirementComponent {
  public static INVALID_PASSWORD_MISSING_LETTER = '12345678';
  public static INVALID_PASSWORD_MISSING_NUMBER = 'abcdefgh';
  public static INVALID_PASSWORD_TOO_SHORT = 'abcd123';
  public static VALID_PASSWORD = 'abcd1234';

  @Input() errorFieldName: string;
  @Input() passwordFormControl: FormControl;
  @Input() requirementText: string;
}
