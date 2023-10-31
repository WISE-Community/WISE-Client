import { ComponentHarness, HarnessLoader } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatErrorHarness } from '@angular/material/form-field/testing';
import { PasswordRequirementHarness } from '../password-requirement/password-requirement.harness';

export class NewPasswordAndConfirmHarness extends ComponentHarness {
  static hostSelector = 'new-password-and-confirm';

  getNewPasswordInput = this.locatorFor(
    MatInputHarness.with({ selector: 'input[name="newPassword"]' })
  );
  getConfirmNewPasswordInput = this.locatorFor(
    MatInputHarness.with({ selector: 'input[name="confirmNewPassword"]' })
  );
  getNewPasswordRequiredError = this.locatorForOptional(
    MatErrorHarness.with({ selector: '.new-password-required-error' })
  );
  getConfirmNewPasswordRequiredError = this.locatorForOptional(
    MatErrorHarness.with({ selector: '.confirm-new-password-required-error' })
  );
  getConfirmNewPasswordDoesNotMatchError = this.locatorForOptional(
    MatErrorHarness.with({ selector: '.confirm-new-password-does-not-match-error' })
  );
  getPasswordRequirements = this.locatorForAll(PasswordRequirementHarness);

  async isMissingLetter(rootLoader: HarnessLoader): Promise<boolean> {
    return this.isMissingRequirement(rootLoader, 'include a letter');
  }

  async isMissingNumber(rootLoader: HarnessLoader): Promise<boolean> {
    return this.isMissingRequirement(rootLoader, 'include a number');
  }

  async isTooShort(rootLoader: HarnessLoader): Promise<boolean> {
    return this.isMissingRequirement(rootLoader, 'be at least 8 characters long');
  }

  private async isMissingRequirement(
    rootLoader: HarnessLoader,
    requirement: string
  ): Promise<boolean> {
    const passwordRequirement = await rootLoader.getHarness(
      PasswordRequirementHarness.with({ text: requirement })
    );
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
