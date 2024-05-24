import { ComponentHarness } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

export class SelectComponentHarness extends ComponentHarness {
  static hostSelector = 'select-component';
  getSelect = this.locatorFor(MatSelectHarness);
}
