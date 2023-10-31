import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../domain/user';
import { injectPasswordErrors } from '../../common/password-helper';
import { MatSnackBar } from '@angular/material/snack-bar';

export class RegisterUserFormComponent {
  protected NAME_REGEX = '^[a-zA-Z]+([ -]?[a-zA-Z]+)*$';

  protected confirmPasswordLabel: string = $localize`Confirm Password`;
  protected passwordLabel: string = $localize`Password`;
  protected passwordsFormGroup: FormGroup = this.fb.group({});
  protected processing: boolean = false;
  user: User;

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

  private translateCreateAccountErrorMessageCode(messageCode: string): string {
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
