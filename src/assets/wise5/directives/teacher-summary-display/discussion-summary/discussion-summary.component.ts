import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Component as WISEComponent } from '../../../common/Component';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';
import { ComponentFactory } from '../../../common/ComponentFactory';
import { DiscussionTeacherComponent } from '../../../components/discussion/discussion-teacher/discussion-teacher.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, DiscussionTeacherComponent, FormsModule, MatSlideToggle],
  selector: 'discussion-summary',
  styleUrl: '../../summary-display/summary-display.component.scss',
  template: `
    <div [class.expanded]="expanded">
      <span class="flex flex-row items-center">
        <h2 class="mat-subtitle-1" i18n>Class Discussion</h2>
        <mat-slide-toggle
          class="mat-primary account-menu__control mat-subtitle-1"
          [(ngModel)]="anonymizeResponses"
          i18n
        >
          Anonymize Responses
        </mat-slide-toggle>
      </span>
      <discussion-teacher
        class="max-h-160 block overflow-y-auto"
        [class.max-h-none]="expanded"
        [nodeId]="nodeId"
        [component]="component"
        [periodId]="periodId"
        [anonymizeResponses]="anonymizeResponses"
        [mode]="'summary'"
      />
    </div>
  `
})
export class DiscussionSummaryComponent extends TeacherSummaryDisplayComponent implements OnInit {
  protected anonymizeResponses: boolean;
  protected component: WISEComponent;
  @Input() expanded: boolean;

  ngOnInit(): void {
    let content = this.projectService.getComponent(this.nodeId, this.componentId);
    content = this.projectService.injectAssetPaths(content);
    this.component = new ComponentFactory().getComponent(content, this.nodeId);
  }
}
