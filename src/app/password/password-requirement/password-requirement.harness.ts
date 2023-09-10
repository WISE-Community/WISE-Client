import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
  TestElement
} from '@angular/cdk/testing';

interface PasswordRequirementHarnessFilters extends BaseHarnessFilters {
  text?: string | RegExp;
}

export class PasswordRequirementHarness extends ComponentHarness {
  static hostSelector = 'password-requirement';

  static with(
    options: PasswordRequirementHarnessFilters
  ): HarnessPredicate<PasswordRequirementHarness> {
    return new HarnessPredicate(PasswordRequirementHarness, options).addOption(
      'text',
      options.text,
      (harness, text) => {
        return HarnessPredicate.stringMatches(harness.getText(), text);
      }
    );
  }

  async getText(): Promise<string> {
    const text = await this.locatorFor('.requirement-text')();
    return text.text();
  }

  async isPristine(): Promise<boolean> {
    const icon = await this.getIcon();
    return icon == null;
  }

  async isFail(): Promise<boolean> {
    const icon = await this.getIcon();
    return (await icon.text()) === 'close';
  }

  async isPass(): Promise<boolean> {
    const icon = await this.getIcon();
    return (await icon.text()) === 'done';
  }

  private async getIcon(): Promise<TestElement> {
    return await this.locatorForOptional('.mat-icon')();
  }
}
