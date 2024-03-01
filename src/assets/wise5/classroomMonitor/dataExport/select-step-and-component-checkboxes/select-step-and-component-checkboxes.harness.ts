import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';

export class SelectStepAndComponentCheckboxesComponentHarness extends ComponentHarness {
  static hostSelector = 'select-step-and-component-checkboxes';

  getDeselectAllButton = this.locatorFor(MatButtonHarness.with({ text: 'Deselect All' }));
  getSelectAllButton = this.locatorFor(MatButtonHarness.with({ text: 'Select All' }));

  getCheckbox(labelText: string): Promise<MatCheckboxHarness> {
    return this.locatorFor(MatCheckboxHarness.with({ label: labelText }))();
  }

  getCheckboxes(): Promise<MatCheckboxHarness[]> {
    return this.locatorForAll(MatCheckboxHarness)();
  }
}
