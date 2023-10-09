import { ComponentHarness } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatErrorHarness } from '@angular/material/form-field/testing';
import { PasswordRequirementHarness } from '../password-requirement/password-requirement.harness';

export class NewPasswordAndConfirmHarness extends ComponentHarness {
  static hostSelector = 'new-password-and-confirm';

  protected getNewPasswordInput = this.locatorFor(
    MatInputHarness.with({ selector: 'input[name="newPassword"]' })
  );
  protected getConfirmNewPasswordInput = this.locatorFor(
    MatInputHarness.with({ selector: 'input[name="confirmNewPassword"]' })
  );
  protected getNewPasswordRequiredError = this.locatorForOptional(
    MatErrorHarness.with({ selector: '.new-password-required-error' })
  );
  protected getConfirmNewPasswordRequiredError = this.locatorForOptional(
    MatErrorHarness.with({ selector: '.confirm-new-password-required-error' })
  );
  protected getConfirmNewPasswordDoesNotMatchError = this.locatorForOptional(
    MatErrorHarness.with({ selector: '.confirm-new-password-does-not-match-error' })
  );
  protected getPasswordRequirements = this.locatorForAll(PasswordRequirementHarness);

  async isMissingLetter(): Promise<boolean> {
    return this.isMissingRequirement('include a letter');
  }

  async isMissingNumber(): Promise<boolean> {
    return this.isMissingRequirement('include a number');
  }

  async isTooShort(): Promise<boolean> {
    return this.isMissingRequirement('be at least 8 characters long');
  }

  private async isMissingRequirement(requirement: string): Promise<boolean> {
    const passwordRequirement = await this.locatorFor(
      PasswordRequirementHarness.with({ text: requirement })
    )();
    return await passwordRequirement.isFail();
  }

  async setNewPassword(value: string): Promise<void> {
    await this.setPassword(value, false);
  }

  async setConfirmNewPassword(value: string): Promise<void> {
    await this.setPassword(value, true);
  }

  async setPassword(value: string, isConfirm: boolean): Promise<void> {
    await this.setInputValue(
      await (isConfirm ? this.getConfirmNewPasswordInput() : this.getNewPasswordInput()),
      value
    );
  }

  private async setInputValue(input: MatInputHarness, value: string): Promise<void> {
    await input.setValue(value);
    await input.blur();
  }

  async isNewPasswordRequiredErrorDisplayed(): Promise<boolean> {
    return (await this.getNewPasswordRequiredError()) != null;
  }

  async isConfirmNewPasswordDoesNotMatchErrorDisplayed(): Promise<boolean> {
    return (await this.getConfirmNewPasswordDoesNotMatchError()) != null;
  }
}
