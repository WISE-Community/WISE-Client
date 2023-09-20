import { ComponentHarness } from '@angular/cdk/testing';
import { clickMenuButton } from '../../common/harness-helper';
import { MatMenuHarness } from '@angular/material/menu/testing';

export class RunMenuHarness extends ComponentHarness {
  static hostSelector = 'app-run-menu';
  private ARCHIVE_MENU_BUTTON_TEXT = 'archiveArchive';
  private UNARCHIVE_MENU_BUTTON_TEXT = 'unarchiveRestore';

  async clickArchiveMenuButton(): Promise<void> {
    return await clickMenuButton(this, this.ARCHIVE_MENU_BUTTON_TEXT);
  }

  async clickUnarchiveMenuButton(): Promise<void> {
    return await clickMenuButton(this, this.UNARCHIVE_MENU_BUTTON_TEXT);
  }

  async hasRestoreMenuButton(): Promise<boolean> {
    const getMenu = this.locatorFor(MatMenuHarness);
    const menu = await getMenu();
    await menu.open();
    let foundRestoreMenuButton = false;
    for (const item of await menu.getItems()) {
      if ((await item.getText()) === this.UNARCHIVE_MENU_BUTTON_TEXT) {
        foundRestoreMenuButton = true;
      }
    }
    return foundRestoreMenuButton;
  }
}
