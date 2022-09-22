import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PasswordService } from '../../../services/password.service';
import { UserService } from '../../../services/user.service';
import { UnlinkGoogleAccountSuccessComponent } from '../unlink-google-account-success/unlink-google-account-success.component';
import { passwordMatchValidator } from '../validators/password-match.validator';

@Component({
  styleUrls: ['./unlink-google-account-password.component.scss'],
  templateUrl: './unlink-google-account-password.component.html'
})
export class UnlinkGoogleAccountPasswordComponent {
  isSaving: boolean = false;
  newPasswordFormGroup: FormGroup = this.fb.group(
    {
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(this.passwordService.minLength),
        Validators.pattern(this.passwordService.pattern)
      ]),
      confirmNewPassword: new FormControl('', [Validators.required])
    },
    { validator: passwordMatchValidator }
  );

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private passwordService: PasswordService,
    private userService: UserService
  ) {}

  submit() {
    this.isSaving = true;
    this.userService
      .unlinkGoogleUser(this.newPasswordFormGroup.get('newPassword').value)
      .add(() => {
        this.isSaving = false;
        this.dialog.closeAll();
        this.dialog.open(UnlinkGoogleAccountSuccessComponent, {
          panelClass: 'dialog-sm'
        });
      });
  }
}
