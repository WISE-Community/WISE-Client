import { ComponentHarness } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

export class SelectStepHarness extends ComponentHarness {
  static hostSelector = 'select-step';
  getSelect = this.locatorFor(MatSelectHarness);
}
