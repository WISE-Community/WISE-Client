import { ComponentHarness } from '@angular/cdk/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';

export class LibraryProjectMenuHarness extends ComponentHarness {
  static hostSelector = 'app-library-project-menu';
  private ARCHIVE_MENU_BUTTON_TEXT = 'archiveArchive';
  private RESTORE_MENU_BUTTON_TEXT = 'unarchiveRestore';

  async hasArchiveMenuButton(): Promise<boolean> {
    return this.hasMenuButton(this.ARCHIVE_MENU_BUTTON_TEXT);
  }

  async hasRestoreMenuButton(): Promise<boolean> {
    return this.hasMenuButton(this.RESTORE_MENU_BUTTON_TEXT);
  }

  async hasMenuButton(text: string): Promise<boolean> {
    const getMenu = this.locatorFor(MatMenuHarness);
    const menu = await getMenu();
    await menu.open();
    let foundArchiveMenuButton = false;
    for (const item of await menu.getItems()) {
      if ((await item.getText()) === text) {
        foundArchiveMenuButton = true;
      }
    }
    return foundArchiveMenuButton;
  }
}
