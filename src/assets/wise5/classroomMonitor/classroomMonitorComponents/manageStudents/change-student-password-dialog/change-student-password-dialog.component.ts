import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { TeacherService } from '../../../../../../app/teacher/teacher.service';
import { passwordMatchValidator } from '../../../../../../app/modules/shared/validators/password-match.validator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordService } from '../../../../../../app/services/password.service';

@Component({
  selector: 'app-change-student-password-dialog',
  templateUrl: './change-student-password-dialog.component.html',
  styleUrls: ['./change-student-password-dialog.component.scss']
})
export class ChangeStudentPasswordDialogComponent implements OnInit {
  canViewStudentNames: boolean;
  changePasswordForm: FormGroup = new FormGroup(
    {
      teacherPassword: new FormControl(''),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(this.passwordService.minLength),
        Validators.pattern(this.passwordService.pattern)
      ]),
      confirmNewPassword: new FormControl('', Validators.required)
    },
    { validators: passwordMatchValidator.bind(this) }
  );
  isChangingPassword: boolean;
  isTeacherGoogleUser: boolean;

  constructor(
    private ConfigService: ConfigService,
    private dialog: MatDialog,
    private passwordService: PasswordService,
    private snackBar: MatSnackBar,
    private TeacherService: TeacherService,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) {}

  ngOnInit(): void {
    this.canViewStudentNames = this.ConfigService.getPermissions().canViewStudentNames;
    this.isTeacherGoogleUser = this.ConfigService.isGoogleUser();
    if (!this.isTeacherGoogleUser) {
      this.changePasswordForm.controls['teacherPassword'].setValidators([Validators.required]);
    }
  }

  changePassword(): void {
    this.isChangingPassword = true;
    this.TeacherService.changeStudentPassword(
      this.ConfigService.getRunId(),
      this.user.id,
      this.changePasswordForm.controls['newPassword'].value,
      this.changePasswordForm.controls['teacherPassword'].value
    ).subscribe(
      () => {
        this.changePasswordSuccess();
      },
      (response) => {
        this.changePasswordError(response.error);
      }
    );
  }

  private changePasswordSuccess(): void {
    this.isChangingPassword = false;
    this.snackBar.open(
      this.canViewStudentNames
        ? $localize`Changed password for ${this.user.name} (${this.user.username}).`
        : $localize`Changed password for Student ${this.user.id}.`
    );
    this.dialog.closeAll();
  }

  private changePasswordError(error: any): void {
    const formError: any = {};
    this.isChangingPassword = false;
    switch (error.messageCode) {
      case 'incorrectPassword':
        formError.incorrectPassword = true;
        this.changePasswordForm.get('teacherPassword').setErrors(formError);
        break;
      case 'invalidPasswordLength':
        formError.minlength = true;
        this.changePasswordForm.get('newPassword').setErrors(formError);
        break;
      case 'invalidPasswordPattern':
        formError.pattern = true;
        this.changePasswordForm.get('newPassword').setErrors(formError);
        break;
    }
  }
}
