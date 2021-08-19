import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { passwordMatchValidator } from '../../../../../../app/modules/shared/validators/password-match.validator';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private ConfigService: ConfigService,
    private dialog: MatDialog,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) {}

  ngOnInit(): void {
    this.canViewStudentNames = this.ConfigService.getPermissions().canViewStudentNames;
    this.isTeacherGoogleUser = this.ConfigService.isGoogleUser();
    if (!this.isTeacherGoogleUser) {
      this.changePasswordForm.controls['teacherPassword'].setValidators([Validators.required]);
    }
  }

  changePassword() {
    this.isChangingPassword = true;
    let params = new HttpParams();
    params = params.set(
      'newStudentPassword',
      this.changePasswordForm.controls['newPassword'].value
    );
    params = params.set(
      'teacherPassword',
      this.changePasswordForm.controls['teacherPassword'].value
    );
    this.http
      .post(
        `/api/teacher/run/${this.ConfigService.getRunId()}/student/${this.user.id}/change-password`,
        params
      )
      .subscribe(
        (response) => {
          this.isChangingPassword = false;
          let message = '';
          if (this.canViewStudentNames) {
            message = $localize`Changed password for ${this.user.name} (${this.user.username}).`;
          } else {
            message = $localize`Changed password for Student ${this.user.id}.`;
          }
          this.snackBar.open(message);
          this.dialog.closeAll();
        },
        (err) => {
          this.isChangingPassword = false;
          this.snackBar.open(
            $localize`Failed to change student password. Please refresh this page and try again.`
          );
        }
      );
  }
}
