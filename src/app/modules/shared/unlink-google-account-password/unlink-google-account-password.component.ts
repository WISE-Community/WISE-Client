import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NewPasswordAndConfirmComponent } from '../../../password/new-password-and-confirm/new-password-and-confirm.component';
import { UserService } from '../../../services/user.service';
import { UnlinkGoogleAccountSuccessComponent } from '../unlink-google-account-success/unlink-google-account-success.component';
import { injectPasswordErrors } from '../../../common/password-helper';

@Component({
  styleUrls: ['./unlink-google-account-password.component.scss'],
  templateUrl: './unlink-google-account-password.component.html'
})
export class UnlinkGoogleAccountPasswordComponent {
  isSaving: boolean = false;
  newPasswordFormGroup: FormGroup = this.fb.group({});

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userService: UserService
  ) {}

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  submit(): void {
    this.isSaving = true;
    this.userService
      .unlinkGoogleUser(
        this.newPasswordFormGroup.get(NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME)
          .value
      )
      .subscribe(
        () => {
          this.success();
        },
        (response: any) => {
          this.error(response.error);
        }
      );
  }

  private success(): void {
    this.isSaving = false;
    this.dialog.closeAll();
    this.dialog.open(UnlinkGoogleAccountSuccessComponent, {
      panelClass: 'dialog-sm'
    });
  }

  private error(error: any): void {
    this.isSaving = false;
    if (error.messageCode === 'invalidPassword') {
      injectPasswordErrors(this.newPasswordFormGroup, error);
    }
  }
}
