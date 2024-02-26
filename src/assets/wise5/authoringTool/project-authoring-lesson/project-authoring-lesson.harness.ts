import { HarnessPredicate } from '@angular/cdk/testing';
import { ProjectAuthoringStepHarness } from '../project-authoring-step/project-authoring-step.harness';
import {
  ProjectAuthoringNodeHarness,
  ProjectAuthoringNodeHarnessFilters
} from '../project-authoring/project-authoring-node.harness';

export class ProjectAuthoringLessonHarness extends ProjectAuthoringNodeHarness {
  static hostSelector = 'project-authoring-lesson';
  getExpandCollapseDiv = this.locatorFor('.lesson-expand-collapse-div');
  getExpandCollapseIcon = this.locatorFor('.expand-collapse-icon .mat-icon');
  getSteps = this.locatorForAll(ProjectAuthoringStepHarness);

  static with(
    options: ProjectAuthoringNodeHarnessFilters
  ): HarnessPredicate<ProjectAuthoringLessonHarness> {
    return new HarnessPredicate(ProjectAuthoringLessonHarness, options).addOption(
      'title',
      options.title,
      async (harness, title) => {
        return HarnessPredicate.stringMatches(harness.getTitle(), title);
      }
    );
  }

  async isExpanded(): Promise<boolean> {
    return (await (await this.getExpandCollapseIcon()).text()) === 'expand_less';
  }

  async isCollapsed(): Promise<boolean> {
    return (await (await this.getExpandCollapseIcon()).text()) === 'expand_more';
  }
}
