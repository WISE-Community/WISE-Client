import { ComponentHarness } from '@angular/cdk/testing';
import { TeacherRunListItemHarness } from '../teacher-run-list-item/teacher-run-list-item.harness';
import { SelectRunsControlsHarness } from '../select-runs-controls/select-runs-controls.harness';
import { MatSelectHarness } from '@angular/material/select/testing';
import { clickMenuButton } from '../../common/harness-helper';

export class TeacherRunListHarness extends ComponentHarness {
  static hostSelector = 'app-teacher-run-list';
  private ARCHIVED_TEXT = 'Archived';
  protected getNoRunsMessageDiv = this.locatorFor('.no-runs-message');
  getRunListItems = this.locatorForAll(TeacherRunListItemHarness);
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

  async getRunListItem(title: string): Promise<any> {
    return await this.locatorForOptional(TeacherRunListItemHarness.with({ title: title }))();
  }

  async getNumRunListItems(): Promise<number> {
    return (await this.getRunListItems()).length;
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
