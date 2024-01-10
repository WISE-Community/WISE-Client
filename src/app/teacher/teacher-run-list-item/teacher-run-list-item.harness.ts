import { ComponentHarness } from '@angular/cdk/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatCardHarness } from '@angular/material/card/testing';
import { RunMenuHarness } from '../run-menu/run-menu.harness';

export class TeacherRunListItemHarness extends ComponentHarness {
  static hostSelector = 'app-teacher-run-list-item';
  protected getCard = this.locatorFor(MatCardHarness);
  protected getCheckbox = this.locatorFor(MatCheckboxHarness);
  protected getMenu = this.locatorFor(RunMenuHarness);

  async checkCheckbox(): Promise<void> {
    return (await this.getCheckbox()).check();
  }

  async isChecked(): Promise<boolean> {
    return (await this.getCheckbox()).isChecked();
  }

  async clickArchiveMenuButton(): Promise<void> {
    return (await this.getMenu()).clickArchiveMenuButton();
  }

  async clickUnarchiveMenuButton(): Promise<void> {
    return (await this.getMenu()).clickUnarchiveMenuButton();
  }

  async getRunTitle(): Promise<string> {
    return (await this.getCard()).getTitleText();
  }

  async isArchived(): Promise<boolean> {
    return (await this.getMenu()).hasRestoreMenuButton();
  }
}
