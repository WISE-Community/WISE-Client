import { ComponentHarness } from '@angular/cdk/testing';
import { ComponentTypeSelectorHarness } from '../component-type-selector/component-type-selector.harness';
import { MatTabGroupHarness } from '@angular/material/tabs/testing';

export class ComponentInfoDialogHarness extends ComponentHarness {
  static hostSelector = 'component-info-dialog';
  getComponentTypeSelector = this.locatorFor(ComponentTypeSelectorHarness);
  getDescription = this.locatorFor('.description');
  getTabGroup = this.locatorFor(MatTabGroupHarness);
}
