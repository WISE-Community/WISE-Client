import { ComponentHarness } from '@angular/cdk/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';

export class SelectAllProjectsCheckboxHarness extends ComponentHarness {
  static hostSelector = 'select-all-projects-checkbox';
  getCheckbox = this.locatorFor(MatCheckboxHarness);
}
