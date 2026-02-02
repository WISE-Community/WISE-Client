import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';
import { UnlinkGoogleAccountConfirmComponent } from '../unlink-google-account-confirm/unlink-google-account-confirm.component';
import { NewPasswordAndConfirmComponent } from '../../../password/new-password-and-confirm/new-password-and-confirm.component';
import { changePasswordError } from '../../../common/password-helper';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    NewPasswordAndConfirmComponent,
    MatButton,
    MatProgressBar
  ],
  selector: 'app-edit-password',
  styleUrl: './edit-password.component.scss',
  templateUrl: './edit-password.component.html'
})
export class EditPasswordComponent implements OnInit {
  private changeDetectorRef = inject(ChangeDetectorRef);
  dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  private userService = inject(UserService);

  @ViewChild('changePasswordForm', { static: false }) changePasswordForm;
  isSaving: boolean = false;
  isGoogleUser: boolean = false;
  newPasswordFormGroup: FormGroup = this.fb.group({});

  changePasswordFormGroup: FormGroup = this.fb.group({
    oldPassword: new FormControl('', [Validators.required]),
    newPasswordFormGroup: this.newPasswordFormGroup
  });

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.isGoogleUser = user.isGoogleUser;
    });
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  saveChanges(): void {
    this.isSaving = true;
    const oldPassword: string = this.getControlFieldValue('oldPassword');
    const newPassword: string = this.getControlFieldValue(
      NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME
    );
    this.userService
      .changePassword(oldPassword, newPassword)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe(
        () => {
          this.changePasswordSuccess();
        },
        (response) => {
          this.changePasswordError(response.error);
        }
      );
  }

  private getControlFieldValue(fieldName: string): string {
    if (
      fieldName === NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME ||
      fieldName === NewPasswordAndConfirmComponent.CONFIRM_NEW_PASSWORD_FORM_CONTROL_NAME
    ) {
      return this.newPasswordFormGroup.get(fieldName).value;
    } else {
      return this.changePasswordFormGroup.get(fieldName).value;
    }
  }

  private changePasswordSuccess(): void {
    this.resetForm();
    this.snackBar.open($localize`Successfully changed password.`);
  }

  private changePasswordError(error: any): void {
    changePasswordError(
      error,
      this.changePasswordFormGroup,
      this.newPasswordFormGroup,
      'oldPassword'
    );
  }

  unlinkGoogleAccount(): void {
    this.dialog.open(UnlinkGoogleAccountConfirmComponent, {
      panelClass: 'dialog-sm'
    });
  }

  private resetForm(): void {
    this.changePasswordForm.resetForm();
  }
}
