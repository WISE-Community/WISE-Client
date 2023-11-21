import { ComponentHarness } from '@angular/cdk/testing';

export class ComponentInfoDialogHarness extends ComponentHarness {
  static hostSelector = 'component-info-dialog';
  getDescription = this.locatorFor('.description');
}
