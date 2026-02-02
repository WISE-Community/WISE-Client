import { Component, Input, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { AnnotationService } from '../../../services/annotationService';
import { NotificationService } from '../../../services/notificationService';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';

@Component({
  imports: [CdkTextareaAutosize, FormsModule, MatFormFieldModule, MatInputModule, TextFieldModule],
  selector: 'edit-component-comment',
  styles: ['.mat-mdc-form-field { display: initial }', 'textarea { resize: none }'],
  templateUrl: 'edit-component-comment.component.html'
})
export class EditComponentCommentComponent {
  private annotationService = inject(AnnotationService);
  private notificationService = inject(NotificationService);

  @Input() comment: string;
  @Input() componentId: string;
  @Input() componentStateId: string;
  @Input() disabled: boolean;
  @Input() fromWorkgroupId: number;
  @Input() nodeId: string;
  @Input() periodId: string;
  @Input() runId: string;
  @Input() toWorkgroupId: number;

  protected commentChanged: Subject<string> = new Subject<string>();
  private isDirty: boolean;
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.commentChanged
        .pipe(
          debounceTime(1000),
          distinctUntilChanged(),
          tap(() => {
            this.isDirty = true;
            this.notificationService.showSavingMessage();
          })
        )
        .subscribe(() => {
          this.saveComment(this.comment);
        })
    );
  }

  ngOnDestroy(): void {
    if (this.isDirty) {
      this.saveComment(this.comment);
    }
    this.subscriptions.unsubscribe();
  }

  saveComment(comment: string): void {
    const annotation = this.annotationService.createAnnotation(
      null,
      this.runId,
      this.periodId,
      this.fromWorkgroupId,
      this.toWorkgroupId,
      this.nodeId,
      this.componentId,
      this.componentStateId,
      null,
      null,
      'comment',
      { value: comment },
      new Date().getTime()
    );
    this.annotationService.saveAnnotation(annotation).then(() => {
      this.isDirty = false;
      this.notificationService.showSavedMessage($localize`Saved comment`);
    });
  }
}
