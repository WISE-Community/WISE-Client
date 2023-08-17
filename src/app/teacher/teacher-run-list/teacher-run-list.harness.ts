import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';
import { TeacherRunListItemHarness } from '../teacher-run-list-item/teacher-run-list-item.harness';
import { SelectRunsControlsHarness } from '../select-runs-controls/select-runs-controls.harness';

export class TeacherRunListHarness extends ComponentHarness {
  static hostSelector = 'app-teacher-run-list';
  protected getArchiveButton = this.locatorFor(MatButtonHarness.with({ text: 'Archive Selected' }));
  protected getArchiveToggle = this.locatorFor(MatSlideToggleHarness);
  protected getRunListItems = this.locatorForAll(TeacherRunListItemHarness);
  protected getSelectRunsControls = this.locatorFor(SelectRunsControlsHarness);
  protected getUnarchiveButton = this.locatorFor(
    MatButtonHarness.with({ text: 'Unarchive Selected' })
  );

  async isShowingArchived(): Promise<boolean> {
    const archiveToggle = await this.getArchiveToggle();
    return await archiveToggle.isChecked();
  }

  async toggleArchiveToggle(): Promise<void> {
    const archiveToggle = await this.getArchiveToggle();
    return await archiveToggle.toggle();
  }

  async checkSelectRunsCheckbox(): Promise<void> {
    const selectRunsControls = await this.getSelectRunsControls();
    return await selectRunsControls.checkCheckbox();
  }

  async uncheckSelectRunsCheckbox(): Promise<void> {
    const selectRunsControls = await this.getSelectRunsControls();
    return await selectRunsControls.uncheckCheckbox();
  }

  async toggleSelectRunsCheckbox(): Promise<void> {
    const selectRunsControls = await this.getSelectRunsControls();
    return await selectRunsControls.toggleCheckbox();
  }

  async isSelectRunsCheckboxChecked(): Promise<boolean> {
    const selectRunsControls = await this.getSelectRunsControls();
    return await selectRunsControls.isChecked();
  }

  async isSelectRunsCheckboxIndeterminate(): Promise<boolean> {
    const selectRunsControls = await this.getSelectRunsControls();
    return await selectRunsControls.isIndeterminate();
  }

  async clickSelectRunsMenuButton(menuButtonText: string): Promise<void> {
    const selectRunsControls = await this.getSelectRunsControls();
    return await selectRunsControls.clickMenuButton(menuButtonText);
  }

  async clickRunListItemCheckbox(index: number): Promise<void> {
    const runListItem = await this.getRunListItem(index);
    return runListItem.checkCheckbox();
  }

  async getRunListItem(index: number): Promise<any> {
    const runListItems = await this.getRunListItems();
    return runListItems[index];
  }

  async getNumRunListItems(): Promise<number> {
    const runListItems = await this.getRunListItems();
    return runListItems.length;
  }

  async clickRunListItemMenuButton(index: number, menuButtonText: string): Promise<void> {
    const runListItem = await this.getRunListItem(index);
    return await runListItem.clickMenuButton(menuButtonText);
  }

  async clickArchiveButton(): Promise<void> {
    const button = await this.getArchiveButton();
    return await button.click();
  }

  async clickUnarchiveButton(): Promise<void> {
    const button = await this.getUnarchiveButton();
    return await button.click();
  }
}
