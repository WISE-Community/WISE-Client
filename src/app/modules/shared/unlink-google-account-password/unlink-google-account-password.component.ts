import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialog,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { NewPasswordAndConfirmComponent } from '../../../password/new-password-and-confirm/new-password-and-confirm.component';
import { UserService } from '../../../services/user.service';
import { UnlinkGoogleAccountSuccessComponent } from '../unlink-google-account-success/unlink-google-account-success.component';
import { injectPasswordErrors } from '../../../common/password-helper';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  imports: [
    MatDialogTitle,
    FormsModule,
    ReactiveFormsModule,
    CdkScrollable,
    MatDialogContent,
    NewPasswordAndConfirmComponent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatProgressBar
  ],
  styleUrl: './unlink-google-account-password.component.scss',
  templateUrl: './unlink-google-account-password.component.html'
})
export class UnlinkGoogleAccountPasswordComponent {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  dialog = inject(MatDialog);
  private userService = inject(UserService);

  isSaving: boolean = false;
  newPasswordFormGroup: FormGroup = this.fb.group({});

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
