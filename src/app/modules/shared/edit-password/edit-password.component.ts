import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';
import { UnlinkGoogleAccountConfirmComponent } from '../unlink-google-account-confirm/unlink-google-account-confirm.component';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss']
})
export class EditPasswordComponent {
  @ViewChild('changePasswordForm', { static: false }) changePasswordForm;
  isSaving: boolean = false;
  isGoogleUser: boolean = false;
  newPasswordFormGroup: FormGroup = this.fb.group({});

  changePasswordFormGroup: FormGroup = this.fb.group({
    oldPassword: new FormControl('', [Validators.required]),
    newPasswordFormGroup: this.newPasswordFormGroup
  });

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private userService: UserService
  ) {}

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
    const newPassword: string = this.getControlFieldValue('newPassword');
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
    if (fieldName === 'newPassword' || fieldName === 'confirmNewPassword') {
      return this.newPasswordFormGroup.get(fieldName).value;
    } else {
      return this.changePasswordFormGroup.get(fieldName).value;
    }
  }

  private changePasswordSuccess(): void {
    this.resetForm();
    this.snackBar.open($localize`Password changed.`);
  }

  private changePasswordError(error: any): void {
    const formError: any = {};
    switch (error.messageCode) {
      case 'incorrectPassword':
        formError.incorrectPassword = true;
        this.changePasswordFormGroup.get('oldPassword').setErrors(formError);
        break;
      case 'invalidPasswordLength':
        formError.minlength = true;
        this.newPasswordFormGroup.get('newPassword').setErrors(formError);
        break;
      case 'invalidPasswordPattern':
        formError.pattern = true;
        this.newPasswordFormGroup.get('newPassword').setErrors(formError);
        break;
    }
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
