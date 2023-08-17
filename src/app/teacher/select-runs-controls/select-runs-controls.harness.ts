import { ComponentHarness } from '@angular/cdk/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';

export class SelectRunsControlsHarness extends ComponentHarness {
  static hostSelector = 'select-runs-controls';
  protected getMenu = this.locatorFor(MatMenuHarness);
  protected getSelectAllCheckbox = this.locatorFor(MatCheckboxHarness);

  async checkCheckbox(): Promise<void> {
    const selectAllCheckBox = await this.getSelectAllCheckbox();
    return await selectAllCheckBox.check();
  }

  async uncheckCheckbox(): Promise<void> {
    const selectAllCheckBox = await this.getSelectAllCheckbox();
    return await selectAllCheckBox.uncheck();
  }

  async toggleCheckbox(): Promise<void> {
    const selectAllCheckBox = await this.getSelectAllCheckbox();
    return await selectAllCheckBox.toggle();
  }

  async isChecked(): Promise<boolean> {
    const checkbox = await this.getSelectAllCheckbox();
    return await checkbox.isChecked();
  }

  async isIndeterminate(): Promise<boolean> {
    const checkbox = await this.getSelectAllCheckbox();
    return await checkbox.isIndeterminate();
  }

  async clickMenuButton(menuButtonText: string): Promise<void> {
    const menu = await this.getMenu();
    await menu.open();
    return await menu.clickItem({ text: menuButtonText });
  }
}
