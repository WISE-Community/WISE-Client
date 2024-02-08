import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { ProjectAuthoringStepHarness } from '../project-authoring-step/project-authoring-step.harness';

export class ProjectAuthoringLessonHarness extends ComponentHarness {
  static hostSelector = 'project-authoring-lesson';
  getExpandButton = this.locatorForOptional(
    MatButtonHarness.with({ selector: '[matTooltip="Click to expand"]' })
  );
  getCollapseButton = this.locatorForOptional(
    MatButtonHarness.with({ selector: '[matTooltip="Click to collapse"]' })
  );
  getSteps = this.locatorForAll(ProjectAuthoringStepHarness);

  async isExpanded(): Promise<boolean> {
    return (await this.getExpandButton()) == null;
  }

  async isCollapsed(): Promise<boolean> {
    return (await this.getCollapseButton()) == null;
  }
}
