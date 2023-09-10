import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'password-requirement',
  templateUrl: './password-requirement.component.html',
  styleUrls: ['./password-requirement.component.scss']
})
export class PasswordRequirementComponent {
  @Input() errorFieldName: string;
  @Input() passwordFormControl: FormControl;
  @Input() requirementText: string;
}
