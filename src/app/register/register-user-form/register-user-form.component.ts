import { FormBuilder } from '@angular/forms';
import { User } from '../../domain/user';
import { injectPasswordErrors } from '../../common/password-helper';
import { MatSnackBar } from '@angular/material/snack-bar';

export class RegisterUserFormComponent {
  NAME_REGEX = '^[a-zA-Z]+([ -]?[a-zA-Z]+)*$';

  confirmPasswordLabel: string = $localize`Confirm Password`;
  passwordLabel: string = $localize`Password`;
  passwordsFormGroup = this.fb.group({});
  processing: boolean = false;

  constructor(protected fb: FormBuilder, protected snackBar: MatSnackBar) {}

  handleCreateAccountError(error: any, userObject: User): void {
    switch (error.messageCode) {
      case 'invalidPassword':
        injectPasswordErrors(this.passwordsFormGroup, error);
        break;
      case 'recaptchaResponseInvalid':
        userObject['isRecaptchaInvalid'] = true;
        break;
      default:
        this.snackBar.open(this.translateCreateAccountErrorMessageCode(error.messageCode));
    }
    this.processing = false;
  }

  translateCreateAccountErrorMessageCode(messageCode: string) {
    switch (messageCode) {
      case 'invalidFirstAndLastName':
        return $localize`Error: First Name and Last Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash`;
      case 'invalidFirstName':
        return $localize`Error: First Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash`;
      case 'invalidLastName':
        return $localize`Error: Last Name must only contain characters A-Z, a-z, spaces, or dashes and can not start or end with a space or dash`;
    }
    return messageCode;
  }
}
