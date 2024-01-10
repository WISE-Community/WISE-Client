import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../student/student.service';
import { finalize } from 'rxjs/operators';
import { PasswordService } from '../../../services/password.service';
import { passwordMatchValidator } from '../../../modules/shared/validators/password-match.validator';

@Component({
  selector: 'app-forgot-student-password-change',
  templateUrl: './forgot-student-password-change.component.html',
  styleUrls: ['./forgot-student-password-change.component.scss']
})
export class ForgotStudentPasswordChangeComponent implements OnInit {
  username: string;
  questionKey: string;
  answer: string;
  changePasswordFormGroup: FormGroup = this.fb.group(
    {
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(this.passwordService.minLength),
        Validators.pattern(this.passwordService.pattern)
      ]),
      confirmNewPassword: new FormControl('', [Validators.required])
    },
    { validator: passwordMatchValidator }
  );
  message: string = '';
  processing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordService,
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.queryParamMap.get('username');
    this.questionKey = this.route.snapshot.queryParamMap.get('questionKey');
    this.answer = this.route.snapshot.queryParamMap.get('answer');
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

  private changePasswordError(error: any): void {
    const formError: any = {};
    switch (error.messageCode) {
      case 'invalidPasswordLength':
        formError.minlength = true;
        this.changePasswordFormGroup.get('newPassword').setErrors(formError);
        break;
      case 'invalidPasswordPattern':
        formError.pattern = true;
        this.changePasswordFormGroup.get('newPassword').setErrors(formError);
        break;
      default:
        this.setErrorOccurredMessage();
    }
  }

  private getNewPassword(): string {
    return this.getControlFieldValue('newPassword');
  }

  private getConfirmNewPassword(): string {
    return this.getControlFieldValue('confirmNewPassword');
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
