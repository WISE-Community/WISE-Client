import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Component as WISEComponent } from '../../../common/Component';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';
import { ComponentFactory } from '../../../common/ComponentFactory';
import { DiscussionTeacherComponent } from '../../../components/discussion/discussion-teacher/discussion-teacher.component';

@Component({
  imports: [CommonModule, DiscussionTeacherComponent],
  selector: 'discussion-summary',
  template: `
    <h2 class="mat-subtitle-1" i18n>Class Discussion</h2>
    <discussion-teacher
      class="max-h-160 block overflow-y-auto"
      [nodeId]="nodeId"
      [component]="component"
      [periodId]="periodId"
      [mode]="'summary'"
    />
  `
})
export class DiscussionSummaryComponent extends TeacherSummaryDisplayComponent implements OnInit {
  protected component: WISEComponent;

  ngOnInit(): void {
    let content = this.projectService.getComponent(this.nodeId, this.componentId);
    content = this.projectService.injectAssetPaths(content);
    this.component = new ComponentFactory().getComponent(content, this.nodeId);
  }
}
