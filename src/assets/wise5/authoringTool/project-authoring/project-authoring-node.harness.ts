import { BaseHarnessFilters, ComponentHarness } from '@angular/cdk/testing';
import { NodeIconAndTitleHarness } from '../choose-node-location/node-icon-and-title/node-icon-and-title.harness';
import { MatButtonHarness } from '@angular/material/button/testing';

export interface ProjectAuthoringNodeHarnessFilters extends BaseHarnessFilters {
  title?: string | RegExp;
}

export class ProjectAuthoringNodeHarness extends ComponentHarness {
  getMoveButton = this.locatorFor(MatButtonHarness.with({ selector: '[matTooltip^="Move"]' }));
  getDeleteButton = this.locatorFor(MatButtonHarness.with({ selector: '[matTooltip^="Delete"]' }));
  getTitleElement = this.locatorFor(NodeIconAndTitleHarness);

  async getTitle(): Promise<string> {
    const stepTitleElement = await this.getTitleElement();
    return await stepTitleElement.getPositionAndTitle();
  }
}
