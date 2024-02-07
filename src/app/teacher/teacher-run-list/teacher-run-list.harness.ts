import { ComponentHarness } from '@angular/cdk/testing';
import { TeacherRunListItemHarness } from '../teacher-run-list-item/teacher-run-list-item.harness';
import { SelectRunsControlsHarness } from '../select-runs-controls/select-runs-controls.harness';
import { MatSelectHarness } from '@angular/material/select/testing';
import { clickMenuButton } from '../../common/harness-helper';

export class TeacherRunListHarness extends ComponentHarness {
  static hostSelector = 'app-teacher-run-list';
  private ARCHIVED_TEXT = 'Archived';
  protected getNoRunsMessageDiv = this.locatorFor('.no-runs-message');
  protected getRunListItems = this.locatorForAll(TeacherRunListItemHarness);
  getSearchInput = this.locatorFor('.search-bar input');
  protected getSelectRunsControls = this.locatorFor(SelectRunsControlsHarness);
  protected getViewSelect = this.locatorFor(MatSelectHarness);

  async isShowingArchived(): Promise<boolean> {
    return (await (await this.getViewSelect()).getValueText()) === this.ARCHIVED_TEXT;
  }

  async showArchived(): Promise<void> {
    return (await this.getViewSelect()).clickOptions({ text: this.ARCHIVED_TEXT });
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
    return clickMenuButton(await this.getSelectRunsControls(), menuButtonText);
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
    return (await this.getSelectRunsControls()).clickArchiveButton();
  }

  async clickUnarchiveButton(): Promise<void> {
    return (await this.getSelectRunsControls()).clickUnarchiveButton();
  }

  async getNoRunsMessage(): Promise<string> {
    return (await this.getNoRunsMessageDiv()).text();
  }
}
