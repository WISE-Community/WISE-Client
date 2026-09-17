import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudentService } from '../../../student/student.service';
import { finalize } from 'rxjs/operators';
import { NewPasswordAndConfirmComponent } from '../../../password/new-password-and-confirm/new-password-and-confirm.component';
import { injectPasswordErrors } from '../../../common/password-helper';
import { PasswordErrors } from '../../../domain/password/password-errors';
import { MatDivider } from '@angular/material/divider';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';
import { PasswordModule } from '../../../password/password.module';
import { MatCard, MatCardContent } from '@angular/material/card';
import { AbstractForgotStudentPasswordComponent } from '../abstract-forgot-student-password.component';

@Component({
  templateUrl: './forgot-student-password-change.component.html',
  styleUrl: './forgot-student-password-change.component.scss',
  imports: [
    MatCard,
    MatCardContent,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    MatButton,
    MatProgressBar,
    MatDivider,
    RouterLink
  ]
})
export class ForgotStudentPasswordChangeComponent extends AbstractForgotStudentPasswordComponent {
  @Input() answer: string;
  changePasswordFormGroup: FormGroup = this.fb.group({});
  @Input() questionKey: string;
  @Input() username: string;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private studentService: StudentService
  ) {
    super();
  }

  protected getFormGroup(): FormGroup {
    return this.changePasswordFormGroup;
  }

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
      case 'incorrectAnswer':
        this.incorrectAnswer();
        break;
      case 'tooManyFailedAnswerAttempts':
        this.tooManyFailedAnswerAttempts();
        break;
      default:
        this.setErrorOccurredMessage();
    }
  }

  /**
   * The answer was carried over from the security question step and cannot be corrected on this
   * page, so resubmitting can only send the same rejected answer again while spending another of
   * the attempts the server allows before it locks the reset. Send the student back to the start
   * of the flow instead.
   */
  private incorrectAnswer(): void {
    this.blockFurtherAttempts(
      $localize`The answer to your security question was not accepted. Please go back to the Forgot Student Password page to try again, or ask your teacher to change your password.`
    );
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
