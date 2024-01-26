import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';

export class SelectRunsControlsHarness extends ComponentHarness {
  static hostSelector = 'select-runs-controls';
  protected getArchiveButton = this.locatorFor(
    MatButtonHarness.with({ selector: '[matTooltip="Archive"]' })
  );
  protected getSelectAllCheckbox = this.locatorFor(MatCheckboxHarness);
  protected getUnarchiveButton = this.locatorFor(
    MatButtonHarness.with({ selector: '[matTooltip="Restore"]' })
  );

  async checkCheckbox(): Promise<void> {
    return (await this.getSelectAllCheckbox()).check();
  }

  async uncheckCheckbox(): Promise<void> {
    return (await this.getSelectAllCheckbox()).uncheck();
  }

  async toggleCheckbox(): Promise<void> {
    return (await this.getSelectAllCheckbox()).toggle();
  }

  async isChecked(): Promise<boolean> {
    return (await this.getSelectAllCheckbox()).isChecked();
  }

  async isIndeterminate(): Promise<boolean> {
    return (await this.getSelectAllCheckbox()).isIndeterminate();
  }

  async clickArchiveButton(): Promise<void> {
    return (await this.getArchiveButton()).click();
  }

  async clickUnarchiveButton(): Promise<void> {
    return (await this.getUnarchiveButton()).click();
  }
}
