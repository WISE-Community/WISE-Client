import { ComponentHarness } from '@angular/cdk/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';

export class SelectStepAndComponentCheckboxesComponentHarness extends ComponentHarness {
  static hostSelector = 'select-step-and-component-checkboxes';

  getCheckbox(labelText: string): Promise<MatCheckboxHarness> {
    return this.locatorFor(MatCheckboxHarness.with({ label: labelText }))();
  }
}
