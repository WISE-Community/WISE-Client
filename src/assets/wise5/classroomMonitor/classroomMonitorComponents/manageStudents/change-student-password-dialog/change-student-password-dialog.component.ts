import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { passwordMatchValidator } from '../../../../../../app/modules/shared/validators/password-match.validator';

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
      newPassword: new FormControl('', Validators.required),
      confirmNewPassword: new FormControl('', Validators.required)
    },
    { validators: passwordMatchValidator.bind(this) }
  );
  isChangingPassword: boolean;
  isTeacherGoogleUser: boolean;

  constructor(protected ConfigService: ConfigService, @Inject(MAT_DIALOG_DATA) public user: any) {}

  ngOnInit(): void {
    this.canViewStudentNames = this.ConfigService.getPermissions().canViewStudentNames;
    this.isTeacherGoogleUser = this.ConfigService.isGoogleUser();
    if (!this.isTeacherGoogleUser) {
      this.changePasswordForm.controls['teacherPassword'].setValidators([Validators.required]);
    }
  }

  changePassword() {}
}
