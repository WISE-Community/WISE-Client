import { HarnessPredicate } from '@angular/cdk/testing';
import {
  ProjectAuthoringNodeHarness,
  ProjectAuthoringNodeHarnessFilters
} from '../project-authoring/project-authoring-node.harness';
import { MatButtonHarness } from '@angular/material/button/testing';

export class ProjectAuthoringStepHarness extends ProjectAuthoringNodeHarness {
  static hostSelector = 'project-authoring-step';

  getCopyButton = this.locatorFor(MatButtonHarness.with({ selector: '[matTooltip="Copy step"]' }));
  getMoveButton = this.locatorFor(MatButtonHarness.with({ selector: '[matTooltip="Move step"]' }));

  static with(
    options: ProjectAuthoringNodeHarnessFilters
  ): HarnessPredicate<ProjectAuthoringStepHarness> {
    return new HarnessPredicate(ProjectAuthoringStepHarness, options).addOption(
      'title',
      options.title,
      async (harness, title) => {
        return HarnessPredicate.stringMatches(harness.getTitle(), title);
      }
    );
  }
}
