import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
      <h2 class="mat-subtitle-1" i18n>Class Discussion</h2>
      <div class="mb-4 flex flex-wrap gap-4 justify-between items-center">
        <mat-slide-toggle
          [(ngModel)]="anonymizeResponses"
          (change)="anonymizeResponsesChanged()"
          i18n
        >
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
        [anonymizeResponses]="anonymizeResponses"
        [mode]="'summary'"
      />
    </div>
  `
})
export class DiscussionSummaryComponent extends TeacherSummaryDisplayComponent implements OnInit {
  @Input() anonymizeResponses: boolean;
  protected component: WISEComponent;
  @Input() expanded: boolean;
  @Output() anonymizeResponsesChange = new EventEmitter<boolean>();

  ngOnInit(): void {
    let content = this.projectService.getComponent(this.nodeId, this.componentId);
    content = this.projectService.injectAssetPaths(content);
    this.component = new ComponentFactory().getComponent(content, this.nodeId);
  }

  protected anonymizeResponsesChanged() {
    this.anonymizeResponsesChange.emit(this.anonymizeResponses);
  }
}
