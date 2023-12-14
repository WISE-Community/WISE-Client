import { ComponentHarness } from '@angular/cdk/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';

export class SelectAllItemsCheckboxHarness extends ComponentHarness {
  static hostSelector = 'select-all-items-checkbox';
  getCheckbox = this.locatorFor(MatCheckboxHarness);
}
