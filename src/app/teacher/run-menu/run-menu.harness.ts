import { ComponentHarness } from '@angular/cdk/testing';
import { clickMenuButton } from '../../common/harness-helper';

export class RunMenuHarness extends ComponentHarness {
  static hostSelector = 'app-run-menu';
  async clickArchiveMenuButton(): Promise<void> {
    return await clickMenuButton(this, 'archiveArchive');
  }

  async clickUnarchiveMenuButton(): Promise<void> {
    return await clickMenuButton(this, 'unarchiveRestore');
  }
}
