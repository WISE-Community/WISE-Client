import { ComponentHarness } from '@angular/cdk/testing';
import { ProjectAuthoringStepHarness } from '../project-authoring-step/project-authoring-step.harness';

export class ProjectAuthoringLessonHarness extends ComponentHarness {
  static hostSelector = 'project-authoring-lesson';
  getExpandCollapseDiv = this.locatorFor('.lesson-expand-collapse-div');
  getExpandCollapseIcon = this.locatorFor('.expand-collapse-icon .mat-icon');
  getSteps = this.locatorForAll(ProjectAuthoringStepHarness);

  async isExpanded(): Promise<boolean> {
    return (await (await this.getExpandCollapseIcon()).text()) === 'expand_less';
  }

  async isCollapsed(): Promise<boolean> {
    return (await (await this.getExpandCollapseIcon()).text()) === 'expand_more';
  }
}
