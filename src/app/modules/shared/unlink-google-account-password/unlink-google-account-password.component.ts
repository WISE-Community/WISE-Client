import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NewPasswordComponent } from '../../../password/new-password/new-password.component';
import { UserService } from '../../../services/user.service';
import { UnlinkGoogleAccountSuccessComponent } from '../unlink-google-account-success/unlink-google-account-success.component';

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
      .unlinkGoogleUser(this.newPasswordFormGroup.get(NewPasswordComponent.FORM_CONTROL_NAME).value)
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
    const formError: any = {};
    switch (error.messageCode) {
      case 'invalidPasswordLength':
        formError.minlength = true;
        this.newPasswordFormGroup.get(NewPasswordComponent.FORM_CONTROL_NAME).setErrors(formError);
        break;
      case 'invalidPasswordPattern':
        formError.pattern = true;
        this.newPasswordFormGroup.get(NewPasswordComponent.FORM_CONTROL_NAME).setErrors(formError);
        break;
    }
  }
}
