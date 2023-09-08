import { ComponentHarness } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatErrorHarness } from '@angular/material/form-field/testing';

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

  async isMissingLetter(): Promise<boolean> {
    return this.isMissingRequirement('letter');
  }

  async isMissingNumber(): Promise<boolean> {
    return this.isMissingRequirement('number');
  }

  async isMissingSymbol(): Promise<boolean> {
    return this.isMissingRequirement('symbol');
  }

  async isTooShort(): Promise<boolean> {
    return this.isMissingRequirement('length');
  }

  private async isMissingRequirement(
    requirement: 'letter' | 'number' | 'symbol' | 'length'
  ): Promise<boolean> {
    const requirementIcon = await this.locatorFor(`.${requirement}-requirement .mat-icon`)();
    return (await requirementIcon.text()) === 'close';
  }

  async setNewPassword(value: string): Promise<void> {
    await this.setInputValue(await this.getNewPasswordInput(), value);
  }

  async setConfirmNewPassword(value: string): Promise<void> {
    await this.setInputValue(await this.getConfirmNewPasswordInput(), value);
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
