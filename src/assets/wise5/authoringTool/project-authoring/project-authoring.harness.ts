import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { ProjectAuthoringLessonHarness } from '../project-authoring-lesson/project-authoring-lesson.harness';

export class ProjectAuthoringHarness extends ComponentHarness {
  static hostSelector = 'project-authoring';
  getExpandAllButton = this.locatorFor(MatButtonHarness.with({ text: '+ Expand All' }));
  getCollapseAllButton = this.locatorFor(MatButtonHarness.with({ text: '- Collapse All' }));
  getLessons = this.locatorForAll(ProjectAuthoringLessonHarness);
}
