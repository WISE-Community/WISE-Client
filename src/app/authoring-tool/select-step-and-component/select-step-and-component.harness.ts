import { ComponentHarness } from '@angular/cdk/testing';
import { SelectStepHarness } from '../select-step/select-step.harness';

export class SelectStepAndComponentHarness extends ComponentHarness {
  static hostSelector = 'select-step-and-component';
  getSelectStep = this.locatorFor(SelectStepHarness);
}
