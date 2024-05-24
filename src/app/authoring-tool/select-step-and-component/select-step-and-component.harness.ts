import { ComponentHarness } from '@angular/cdk/testing';
import { SelectStepHarness } from '../select-step/select-step.harness';
import { SelectComponentHarness } from '../select-component/select-component.harness';

export class SelectStepAndComponentHarness extends ComponentHarness {
  static hostSelector = 'select-step-and-component';
  getSelectComponent = this.locatorFor(SelectComponentHarness);
  getSelectStep = this.locatorFor(SelectStepHarness);
}
