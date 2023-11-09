import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../../student/student.service';
import { finalize } from 'rxjs/operators';
import { NewPasswordAndConfirmComponent } from '../../../password/new-password-and-confirm/new-password-and-confirm.component';
import { injectPasswordErrors } from '../../../common/password-helper';
import { PasswordErrors } from '../../../domain/password/password-errors';

@Component({
  selector: 'forgot-student-password-change',
  templateUrl: './forgot-student-password-change.component.html',
  styleUrls: ['./forgot-student-password-change.component.scss']
})
export class ForgotStudentPasswordChangeComponent {
  @Input() answer: string;
  changePasswordFormGroup: FormGroup = this.fb.group({});
  message: string = '';
  processing: boolean = false;
  @Input() questionKey: string;
  @Input() username: string;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private studentService: StudentService
  ) {}

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  submit(): void {
    this.clearMessage();
    const password = this.getNewPassword();
    const confirmPassword = this.getConfirmNewPassword();
    this.processing = true;
    this.studentService
      .changePassword(this.username, this.answer, password, confirmPassword)
      .pipe(
        finalize(() => {
          this.processing = false;
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

  private changePasswordSuccess(): void {
    this.goToSuccessPage();
  }

  private changePasswordError(error: PasswordErrors): void {
    switch (error.messageCode) {
      case 'invalidPassword':
        injectPasswordErrors(this.changePasswordFormGroup, error);
        break;
      default:
        this.setErrorOccurredMessage();
    }
  }

  private getNewPassword(): string {
    return this.getControlFieldValue(NewPasswordAndConfirmComponent.NEW_PASSWORD_FORM_CONTROL_NAME);
  }

  private getConfirmNewPassword(): string {
    return this.getControlFieldValue(
      NewPasswordAndConfirmComponent.CONFIRM_NEW_PASSWORD_FORM_CONTROL_NAME
    );
  }

  private getControlFieldValue(fieldName: string): string {
    return this.changePasswordFormGroup.get(fieldName).value;
  }

  private setErrorOccurredMessage(): void {
    this.setMessage($localize`An error occurred. Please try again.`);
  }

  private setMessage(message: string): void {
    this.message = message;
  }

  private clearMessage(): void {
    this.message = '';
  }

  private goToSuccessPage(): void {
    const params = {
      username: this.username
    };
    this.router.navigate(['/forgot/student/password/complete'], {
      queryParams: params,
      skipLocationChange: true
    });
  }
}
