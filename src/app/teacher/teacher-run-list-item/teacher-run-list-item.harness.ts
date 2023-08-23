import { ComponentHarness } from '@angular/cdk/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatCardHarness } from '@angular/material/card/testing';

export class TeacherRunListItemHarness extends ComponentHarness {
  static hostSelector = 'app-teacher-run-list-item';
  protected getCard = this.locatorFor(MatCardHarness);
  protected getCheckbox = this.locatorFor(MatCheckboxHarness);
  protected getMenu = this.locatorFor(MatMenuHarness);

  async checkCheckbox(): Promise<void> {
    return (await this.getCheckbox()).check();
  }

  async isChecked(): Promise<boolean> {
    return (await this.getCheckbox()).isChecked();
  }

  async clickMenuButton(menuButtonText: string): Promise<void> {
    const menu = await this.getMenu();
    await menu.open();
    return menu.clickItem({ text: menuButtonText });
  }

  async getRunTitle(): Promise<string> {
    return (await this.getCard()).getTitleText();
  }
}
