import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { SaveTimeMessageComponent } from '../../../common/save-time-message/save-time-message.component';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClassResponse } from '../class-response/class-response.component';
import { TeacherPresentationSelectionStore } from '../../../teacher-presentation/teacher-presentation-selection.store';
import { StudentNamesDisplayMode } from '../../../teacher-presentation/teacher-presentation-config';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
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
export class ClassResponseTeacherComponent extends ClassResponse implements OnInit, OnChanges {
  @Output() hidePostEvent: any = new EventEmitter();
  @Input() isDisabled: boolean;
  @Input() mode: any;
  @Input() numReplies: number;
  @Input() response: any;
  @Output() showPostEvent: any = new EventEmitter();
  @Output() submitButtonClicked: any = new EventEmitter();
  @Output() toggleHiddenPost: any = new EventEmitter();

  @Input() selectable: boolean = false;
  @Input() presentationStore?: TeacherPresentationSelectionStore;
  @Input() studentNamesDisplayMode?: StudentNamesDisplayMode;
  @Input() presentationSelectedIds?: Set<number>;

  get isPresentationMode(): boolean {
    return this.mode === 'presentation';
  }

  get showAuthorHeader(): boolean {
    return !(this.isPresentationMode && this.studentNamesDisplayMode === 'hide');
  }

  get hasRepliesToDisplay(): boolean {
    return this.isPresentationMode
      ? this.repliesToShow.length > 0
      : (this.response?.replies || []).length > 0;
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.updateRepliesToShow();
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    this.updateRepliesToShow();
  }

  private updateRepliesToShow(): void {
    if (this.isPresentationMode) {
      this.expanded = true;
      this.repliesToShow = (this.response?.replies || []).filter((reply: any) =>
        this.isReplySelected(reply)
      );
    }
  }

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

  protected isParentSelected(): boolean {
    if (this.presentationStore) {
      return this.presentationStore.isSelected(this.response.id);
    }
    if (this.presentationSelectedIds) {
      return this.presentationSelectedIds.has(this.response.id);
    }
    return false;
  }

  protected isParentCheckboxDisabled(): boolean {
    if (!this.presentationStore) return false;
    const commentIds = (this.response.replies || []).map((r: any) => r.id);
    return this.presentationStore.isParentLockedByComments(commentIds);
  }

  protected onParentCheckboxChange(): void {
    if (!this.presentationStore) return;
    const commentIds = (this.response.replies || []).map((r: any) => r.id);
    this.presentationStore.toggleParent(this.response.id, commentIds);
  }

  protected isReplySelected(reply: any): boolean {
    if (this.presentationStore) {
      return this.presentationStore.isSelected(reply.id);
    }
    if (this.presentationSelectedIds) {
      return this.presentationSelectedIds.has(reply.id);
    }
    return false;
  }

  protected onReplyCheckboxChange(reply: any): void {
    if (!this.presentationStore) return;
    this.presentationStore.toggleComment(reply.id, this.response.id);
  }
}
