import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../domain/user';
import { NewPasswordAndConfirmComponent } from '../../password/new-password-and-confirm/new-password-and-confirm.component';
import { FormBuilder, FormGroup } from '@angular/forms';

export class RegisterUserFormComponent {
  protected NAME_REGEX = '^[a-zA-Z]+([ -]?[a-zA-Z]+)*$';

  protected confirmPasswordLabel: string = $localize`Confirm Password`;
  protected passwordLabel: string = $localize`Password`;
  protected passwordsFormGroup: FormGroup = this.fb.group({});
  protected processing: boolean = false;
  user: User;

  constructor(protected fb: FormBuilder, protected snackBar: MatSnackBar) {}

  protected createAccountError(error: any): void {
    const formError: any = {};
    switch (error.messageCode) {
      case 'invalidPasswordLength':
        formError.minlength = true;
        this.passwordsFormGroup
          .get(NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME)
          .setErrors(formError);
        break;
      case 'invalidPasswordPattern':
        formError.pattern = true;
        this.passwordsFormGroup
          .get(NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME)
          .setErrors(formError);
        break;
      case 'recaptchaResponseInvalid':
        this.user['isRecaptchaInvalid'] = true;
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
