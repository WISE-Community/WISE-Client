import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Component as WISEComponent } from '../../../common/Component';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';
import { ComponentFactory } from '../../../common/ComponentFactory';
import { DiscussionTeacherComponent } from '../../../components/discussion/discussion-teacher/discussion-teacher.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { TEACHER_SUMMARY_CONFIG } from '../TeacherSummaryConfig';

@Component({
  imports: [CommonModule, DiscussionTeacherComponent, FormsModule, MatSlideToggle],
  selector: 'discussion-summary',
  styleUrl: '../../summary-display/summary-display.component.scss',
  template: `
    <div [class.expanded]="expanded">
      <h2 class="mat-subtitle-1" i18n>Class Discussion</h2>
      <div class="mb-4 flex flex-wrap gap-4 justify-between items-center">
        <mat-slide-toggle [(ngModel)]="teacherSummaryConfig.anonymizeStudentNames" i18n>
          Hide student names
        </mat-slide-toggle>
        @if (component.content.anonymizeResponses) {
          <span class="mat-caption" i18n
            >Note: Students do not see each other's names in this activity.</span
          >
        }
      </div>
      <discussion-teacher
        class="max-h-160 block overflow-y-auto"
        [class.max-h-none]="expanded"
        [nodeId]="nodeId"
        [component]="component"
        [periodId]="periodId"
        [anonymizeResponses]="teacherSummaryConfig.anonymizeStudentNames"
        [mode]="'summary'"
      />
    </div>
  `
})
export class DiscussionSummaryComponent extends TeacherSummaryDisplayComponent implements OnInit {
  protected component: WISEComponent;
  @Input() expanded: boolean;

  protected teacherSummaryConfig = inject(TEACHER_SUMMARY_CONFIG);

  ngOnInit(): void {
    let content = this.projectService.getComponent(this.nodeId, this.componentId);
    content = this.projectService.injectAssetPaths(content);
    this.component = new ComponentFactory().getComponent(content, this.nodeId);
  }
}
