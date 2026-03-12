import { Component, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ComponentHeaderComponent } from '../../../directives/component-header/component-header.component';
import { ComponentAnnotationsComponent } from '../../../directives/componentAnnotations/component-annotations.component';
import { MatCard } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ClassResponse } from '../class-response/class-response.component';
import { DiscussionStudent } from '../discussion-student/discussion-student.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CdkTextareaAutosize,
    ClassResponse,
    ComponentAnnotationsComponent,
    ComponentHeaderComponent,
    FormsModule,
    MatButton,
    MatCard,
    MatFormField,
    MatIcon,
    MatInput,
    NgClass
  ],
  selector: 'discussion-teacher',
  styleUrl: '../discussion-student/discussion-student.component.scss',
  templateUrl: '../discussion-student/discussion-student.component.html'
})
export class DiscussionTeacherComponent extends DiscussionStudent {
  @Input() periodId: number;
  @Input() anonymizeResponses: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.component) {
      this.componentId = changes.component.currentValue.id;
    }
    if (this.componentId) {
      this.renderDiscussion();
    }
  }

  protected getPeriodId(): number {
    return this.periodId;
  }

  protected isClassmateResponsesGated(): boolean {
    // allow teacher to always see all responses, no need to post to see others
    return false;
  }

  disableComponentIfNecessary(): void {
    // no need to disable the component for teacher
  }

  protected isAnonymizeResponses(): boolean {
    return this.anonymizeResponses;
  }
}
