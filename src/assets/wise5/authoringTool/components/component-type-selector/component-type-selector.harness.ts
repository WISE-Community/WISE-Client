import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

export class ComponentTypeSelectorHarness extends ComponentHarness {
  static hostSelector = 'component-type-selector';
  getPreviousComponentTypeButton = this.locatorFor(
    MatButtonHarness.with({ selector: '[aria-label="Previous component type"]' })
  );
  getNextComponentTypeButton = this.locatorFor(
    MatButtonHarness.with({ selector: '[aria-label="Next component type"]' })
  );
  getComponentTypeSelect = this.locatorFor(MatSelectHarness);
}
