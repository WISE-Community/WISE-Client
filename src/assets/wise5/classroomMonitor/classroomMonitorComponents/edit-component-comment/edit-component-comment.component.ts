import { Component, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { AnnotationService } from '../../../services/annotationService';
import { NotificationService } from '../../../services/notificationService';

@Component({
  selector: 'edit-component-comment',
  styles: ['.mat-mdc-form-field { display: initial }', 'textarea { resize: none }'],
  templateUrl: 'edit-component-comment.component.html'
})
export class EditComponentCommentComponent {
  @Input() comment: string;
  @Input() componentId: string;
  @Input() componentStateId: string;
  @Input() disabled: boolean;
  @Input() fromWorkgroupId: number;
  @Input() nodeId: string;
  @Input() periodId: string;
  @Input() runId: string;
  @Input() toWorkgroupId: number;

  commentChanged: Subject<string> = new Subject<string>();
  isDirty: boolean;
  subscriptions: Subscription = new Subscription();

  constructor(
    private annotationService: AnnotationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.commentChanged
        .pipe(
          debounceTime(1000),
          distinctUntilChanged(),
          tap(() => {
            this.setIsDirty(true);
            this.notificationService.showSavingMessage();
          })
        )
        .subscribe(() => {
          this.saveComment(this.comment);
        })
    );
  }

  ngOnDestroy() {
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
      this.setIsDirty(false);
      this.notificationService.showSavedMessage($localize`Saved Comment`);
    });
  }

  setIsDirty(isDirty: boolean) {
    this.isDirty = isDirty;
  }
}
