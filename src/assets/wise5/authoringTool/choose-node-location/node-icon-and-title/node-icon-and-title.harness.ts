import { ComponentHarness } from '@angular/cdk/testing';

export class NodeIconAndTitleHarness extends ComponentHarness {
  static hostSelector = 'node-icon-and-title';

  getStepPosition = this.locatorForOptional('.step-number');
  getStepTitle = this.locatorFor('.step-title');

  async getPositionAndTitle(): Promise<string> {
    const position = await (await this.getStepPosition())?.text();
    const title = await (await this.getStepTitle()).text();
    return position == null ? title : `${position} ${title}`;
  }
}
