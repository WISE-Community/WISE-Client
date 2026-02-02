import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { TeacherService } from '../../../../../../app/teacher/teacher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewPasswordAndConfirmComponent } from '../../../../../../app/password/new-password-and-confirm/new-password-and-confirm.component';
import { changePasswordError } from '../../../../../../app/common/password-helper';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { PasswordModule } from '../../../../../../app/password/password.module';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    PasswordModule,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatProgressBar
  ],
  selector: 'app-change-student-password-dialog',
  styles: ['form { margin-top: 16px; }'],
  templateUrl: './change-student-password-dialog.component.html'
})
export class ChangeStudentPasswordDialogComponent implements OnInit {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private configService = inject(ConfigService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private teacherService = inject(TeacherService);
  user = inject(MAT_DIALOG_DATA);

  canViewStudentNames: boolean;
  changePasswordForm: FormGroup = new FormGroup({
    teacherPassword: new FormControl('')
  });
  confirmPasswordLabel: string = $localize`Confirm New Student Password`;
  isChangingPassword: boolean;
  isTeacherGoogleUser: boolean;
  passwordLabel: string = $localize`New Student Password`;

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
