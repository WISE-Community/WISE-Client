import { FormGroup } from '@angular/forms';
import { NewPasswordAndConfirmComponent } from '../password/new-password-and-confirm/new-password-and-confirm.component';
import { PasswordErrors } from '../domain/password/password-errors';

export function injectPasswordErrors(formGroup: FormGroup, passwordErrors: PasswordErrors): void {
  formGroup
    .get(NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME)
    .setErrors(passwordErrors);
}
