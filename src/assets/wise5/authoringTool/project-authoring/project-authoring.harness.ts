import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { ProjectAuthoringLessonHarness } from '../project-authoring-lesson/project-authoring-lesson.harness';
import { ProjectAuthoringStepHarness } from '../project-authoring-step/project-authoring-step.harness';

export class ProjectAuthoringHarness extends ComponentHarness {
  static hostSelector = 'project-authoring';
  getExpandAllButton = this.locatorFor(MatButtonHarness.with({ text: '+ Expand All' }));
  getCollapseAllButton = this.locatorFor(MatButtonHarness.with({ text: '- Collapse All' }));
  getLessons = this.locatorForAll(ProjectAuthoringLessonHarness);
  getSteps = this.locatorForAll(ProjectAuthoringStepHarness);

  getStep(title: string): Promise<ProjectAuthoringStepHarness> {
    return this.locatorForOptional(ProjectAuthoringStepHarness.with({ title: title }))();
  }
}
