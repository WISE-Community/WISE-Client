import { ComponentHarness } from '@angular/cdk/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';

export class SelectRunsControlsHarness extends ComponentHarness {
  static hostSelector = 'select-runs-controls';
  protected getMenu = this.locatorFor(MatMenuHarness);
  protected getSelectAllCheckbox = this.locatorFor(MatCheckboxHarness);

  async checkCheckbox(): Promise<void> {
    return (await this.getSelectAllCheckbox()).check();
  }

  async uncheckCheckbox(): Promise<void> {
    return (await this.getSelectAllCheckbox()).uncheck();
  }

  async toggleCheckbox(): Promise<void> {
    return (await this.getSelectAllCheckbox()).toggle();
  }

  async isChecked(): Promise<boolean> {
    return (await this.getSelectAllCheckbox()).isChecked();
  }

  async isIndeterminate(): Promise<boolean> {
    return (await this.getSelectAllCheckbox()).isIndeterminate();
  }

  async clickMenuButton(menuButtonText: string): Promise<void> {
    const menu = await this.getMenu();
    await menu.open();
    return menu.clickItem({ text: menuButtonText });
  }
}
