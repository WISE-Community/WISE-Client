import { ComponentHarness } from '@angular/cdk/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';

export class TeacherRunListItemHarness extends ComponentHarness {
  static hostSelector = 'app-teacher-run-list-item';
  protected getCheckbox = this.locatorFor(MatCheckboxHarness);
  protected getMenu = this.locatorFor(MatMenuHarness);

  async checkCheckbox(): Promise<void> {
    const checkbox = await this.getCheckbox();
    return await checkbox.check();
  }

  async isChecked(): Promise<boolean> {
    const checkbox = await this.getCheckbox();
    return await checkbox.isChecked();
  }

  async clickMenuButton(menuButtonText: string): Promise<void> {
    const menu = await this.getMenu();
    await menu.open();
    return await menu.clickItem({ text: menuButtonText });
  }
}
