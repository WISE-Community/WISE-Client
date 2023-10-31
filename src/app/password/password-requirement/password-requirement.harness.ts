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
    return this.iconHasText('close');
  }

  async isPass(): Promise<boolean> {
    return this.iconHasText('done');
  }

  private async iconHasText(text: string): Promise<boolean> {
    const icon = await this.getIcon();
    return (await icon.text()) === text;
  }

  private async getIcon(): Promise<TestElement> {
    return await this.locatorForOptional('.mat-icon')();
  }
}
