import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { TeacherService } from '../../../../../../app/teacher/teacher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewPasswordAndConfirmComponent } from '../../../../../../app/password/new-password-and-confirm/new-password-and-confirm.component';
import { changePasswordError } from '../../../../../../app/common/password-helper';

@Component({
  selector: 'app-change-student-password-dialog',
  templateUrl: './change-student-password-dialog.component.html',
  styleUrls: ['./change-student-password-dialog.component.scss']
})
export class ChangeStudentPasswordDialogComponent implements OnInit {
  canViewStudentNames: boolean;
  changePasswordForm: FormGroup = new FormGroup({
    teacherPassword: new FormControl('')
  });
  confirmPasswordLabel: string = $localize`Confirm New Student Password`;
  isChangingPassword: boolean;
  isTeacherGoogleUser: boolean;
  passwordLabel: string = $localize`New Student Password`;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private configService: ConfigService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private teacherService: TeacherService,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) {}

  ngOnInit(): void {
    this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
    this.isTeacherGoogleUser = this.configService.isGoogleUser();
    if (!this.isTeacherGoogleUser) {
      this.changePasswordForm.controls['teacherPassword'].setValidators([Validators.required]);
    }
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  changePassword(): void {
    this.isChangingPassword = true;
    this.teacherService
      .changeStudentPassword(
        this.configService.getRunId(),
        this.user.id,
        this.changePasswordForm.controls[
          NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME
        ].value,
        this.changePasswordForm.controls['teacherPassword'].value
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
    this.isChangingPassword = false;
    changePasswordError(error, this.changePasswordForm, this.changePasswordForm, 'teacherPassword');
  }
}
