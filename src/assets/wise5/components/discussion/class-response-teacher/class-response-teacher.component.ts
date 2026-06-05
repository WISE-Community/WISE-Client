import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { getAvatarColorForWorkgroupId } from '../../../common/workgroup/workgroup';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { SaveTimeMessageComponent } from '../../../common/save-time-message/save-time-message.component';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClassResponse } from '../class-response/class-response.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CdkTextareaAutosize,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    SaveTimeMessageComponent,
    TextFieldModule
  ],
  selector: 'class-response-teacher',
  styleUrl: '../class-response/class-response.component.scss',
  styles: `
    @reference "tailwindcss";

    details:open > summary {
      .details-closed {
        @apply hidden;
      }

      .details-open {
        @apply flex;
      }
    }

    .reply-details:open {
      @apply px-2;

      > summary {
        @apply -mx-2 mb-1 rounded-b-none;
      }
    }

    summary {
      @apply italic cursor-pointer px-2 flex items-center gap-2;

      &::-webkit-details-marker {
        display: none;
      }
    }
  `,
  templateUrl: './class-response-teacher.component.html'
})
export class ClassResponseTeacherComponent extends ClassResponse {
  @Output() hidePostEvent: any = new EventEmitter();
  @Input() isDisabled: boolean;
  @Input() mode: any;
  @Input() numReplies: number;
  @Input() response: any;
  @Output() showPostEvent: any = new EventEmitter();
  @Output() submitButtonClicked: any = new EventEmitter();
  @Output() toggleHiddenPost: any = new EventEmitter();

  protected expanded: boolean = false;
  protected repliesToShow: any[] = [];

  protected hidePost(componentState: any): void {
    if (confirm($localize`Are you sure you want to hide this content?`)) {
      this.hidePostEvent.emit(componentState);
    }
  }

  protected isHidden(post: any): boolean {
    return post.latestInappropriateFlagAnnotation?.data?.action === 'Delete';
  }

  protected showPost(componentState: any): void {
    if (confirm($localize`Are you sure you want to show this content?`)) {
      this.showPostEvent.emit(componentState);
    }
  }
}
