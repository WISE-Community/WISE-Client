import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive()
export abstract class AbstractForgotStudentPasswordComponent {
  protected message: string = '';
  protected processing: boolean = false;
  protected showForgotPasswordLink: boolean = false;

  protected abstract getFormGroup(): FormGroup;

  /**
   * The server temporarily blocks the reset after several incorrect security answers. Disabling
   * the form stops the student from immediately trying again, and the link sends them back to the
   * start of the flow. Unlike the teacher flow there is no new verification code to generate, so
   * the message asks them to wait or to ask their teacher rather than promising the link unblocks
   * them.
   */
  protected tooManyFailedAnswerAttempts(): void {
    this.blockFurtherAttempts(
      $localize`You have entered an incorrect answer too many times. For security reasons, we will lock the ability to change your password for 10 minutes. After 10 minutes, please go back to the Forgot Student Password page to try again, or ask your teacher to change your password.`
    );
  }

  protected blockFurtherAttempts(message: string): void {
    this.message = message;
    this.getFormGroup().disable();
    this.showForgotPasswordLink = true;
  }

  protected setErrorOccurredMessage(): void {
    this.message = $localize`An error occurred. Please try again.`;
  }

  protected clearMessage(): void {
    this.message = '';
  }
}
