import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { ProjectAuthoringLessonHarness } from '../project-authoring-lesson/project-authoring-lesson.harness';
import { ProjectAuthoringStepHarness } from '../project-authoring-step/project-authoring-step.harness';

export class ProjectAuthoringHarness extends ComponentHarness {
  static hostSelector = 'project-authoring';
  getCollapseAllButton = this.locatorFor(MatButtonHarness.with({ text: '- Collapse All' }));
  getExpandAllButton = this.locatorFor(MatButtonHarness.with({ text: '+ Expand All' }));
  getLessons = this.locatorForAll(ProjectAuthoringLessonHarness);
  getSteps = this.locatorForAll(ProjectAuthoringStepHarness);

  getLesson(title: string): Promise<ProjectAuthoringLessonHarness> {
    return this.locatorForOptional(ProjectAuthoringLessonHarness.with({ title: title }))();
  }

  getStep(title: string): Promise<ProjectAuthoringStepHarness> {
    return this.locatorForOptional(ProjectAuthoringStepHarness.with({ title: title }))();
  }
}
