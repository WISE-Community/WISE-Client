import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { NodeIconAndTitleHarness } from '../choose-node-location/node-icon-and-title/node-icon-and-title.harness';
import { MatButtonHarness } from '@angular/material/button/testing';

interface ProjectAuthoringStepHarnessFilters extends BaseHarnessFilters {
  title?: string | RegExp;
}

export class ProjectAuthoringStepHarness extends ComponentHarness {
  static hostSelector = 'project-authoring-step';

  getCopyButton = this.locatorFor(MatButtonHarness.with({ selector: '.copy-button' }));
  getDeleteButton = this.locatorFor(MatButtonHarness.with({ selector: '.delete-button' }));
  getMoveButton = this.locatorFor(MatButtonHarness.with({ selector: '.move-button' }));
  getStepTitleElement = this.locatorFor(NodeIconAndTitleHarness);

  static with(
    options: ProjectAuthoringStepHarnessFilters
  ): HarnessPredicate<ProjectAuthoringStepHarness> {
    return new HarnessPredicate(ProjectAuthoringStepHarness, options).addOption(
      'title',
      options.title,
      async (harness, title) => {
        return HarnessPredicate.stringMatches(harness.getStepTitle(), title);
      }
    );
  }

  async getStepTitle(): Promise<string> {
    const stepTitleElement = await this.getStepTitleElement();
    return await stepTitleElement.getPositionAndTitle();
  }
}
