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
    return (await this.getArchiveToggle()).isChecked();
  }

  async toggleArchiveToggle(): Promise<void> {
    return (await this.getArchiveToggle()).toggle();
  }

  async checkSelectRunsCheckbox(): Promise<void> {
    return (await this.getSelectRunsControls()).checkCheckbox();
  }

  async uncheckSelectRunsCheckbox(): Promise<void> {
    return (await this.getSelectRunsControls()).uncheckCheckbox();
  }

  async toggleSelectRunsCheckbox(): Promise<void> {
    return (await this.getSelectRunsControls()).toggleCheckbox();
  }

  async isSelectRunsCheckboxChecked(): Promise<boolean> {
    return (await this.getSelectRunsControls()).isChecked();
  }

  async isSelectRunsCheckboxIndeterminate(): Promise<boolean> {
    return (await this.getSelectRunsControls()).isIndeterminate();
  }

  async clickSelectRunsMenuButton(menuButtonText: string): Promise<void> {
    return (await this.getSelectRunsControls()).clickMenuButton(menuButtonText);
  }

  async clickRunListItemCheckbox(index: number): Promise<void> {
    return (await this.getRunListItem(index)).checkCheckbox();
  }

  async isRunListItemCheckboxChecked(index: number): Promise<boolean> {
    return (await this.getRunListItem(index)).isChecked();
  }

  async getRunListItem(index: number): Promise<any> {
    return (await this.getRunListItems())[index];
  }

  async getNumRunListItems(): Promise<number> {
    return (await this.getRunListItems()).length;
  }

  async getNumSelectedRunListItems(): Promise<number> {
    let numSelectedRunListItems = 0;
    for (let i = 0; i < (await this.getRunListItems()).length; i++) {
      if (await this.isRunListItemCheckboxChecked(i)) {
        numSelectedRunListItems++;
      }
    }
    return numSelectedRunListItems;
  }

  async clickRunListItemMenuArchiveButton(index: number): Promise<void> {
    return (await this.getRunListItem(index)).clickArchiveMenuButton();
  }

  async clickRunListItemMenuUnarchiveButton(index: number): Promise<void> {
    return (await this.getRunListItem(index)).clickUnarchiveMenuButton();
  }

  async clickArchiveButton(): Promise<void> {
    return (await this.getArchiveButton()).click();
  }

  async clickUnarchiveButton(): Promise<void> {
    return (await this.getUnarchiveButton()).click();
  }
}
