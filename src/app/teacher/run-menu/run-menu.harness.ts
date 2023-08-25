import { ComponentHarness } from '@angular/cdk/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';

export class RunMenuHarness extends ComponentHarness {
  static hostSelector = 'app-run-menu';
  protected getMenu = this.locatorFor(MatMenuHarness);

  async clickMenuButton(menuButtonText: string): Promise<void> {
    const menu = await this.getMenu();
    await menu.open();
    return menu.clickItem({ text: menuButtonText });
  }

  async clickArchiveMenuButton(): Promise<void> {
    return await this.clickMenuButton('archiveArchive');
  }

  async clickUnarchiveMenuButton(): Promise<void> {
    return await this.clickMenuButton('unarchiveRestore');
  }
}
