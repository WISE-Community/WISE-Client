import { ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../domain/user';
import { injectPasswordErrors } from '../../common/password-helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReCaptchaV3Service } from 'ng-recaptcha-2';
import { ConfigService } from '../../services/config.service';
import { UtilService } from '../../services/util.service';

export class RegisterUserFormComponent {
  protected fb = inject(FormBuilder);
  protected snackBar = inject(MatSnackBar);
  protected changeDetectorRef = inject(ChangeDetectorRef);
  protected configService = inject(ConfigService);
  protected recaptchaV3Service = inject(ReCaptchaV3Service);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected utilService = inject(UtilService);

  protected NAME_REGEX = '^[a-zA-Z]+([ -]?[a-zA-Z]+)*$';

  protected confirmPasswordLabel: string = $localize`Confirm Password`;
  protected passwordLabel: string = $localize`Password`;
  protected passwordsFormGroup: FormGroup = this.fb.group({});
  protected processing: boolean = false;
  user: User;

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
