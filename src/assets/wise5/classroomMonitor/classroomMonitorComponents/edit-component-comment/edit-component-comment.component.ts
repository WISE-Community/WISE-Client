import { Component, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { AnnotationService } from '../../../services/annotationService';

@Component({
  selector: 'edit-component-comment',
  styles: ['.mat-form-field { display: initial }', 'textarea { resize: none }'],
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

  constructor(private AnnotationService: AnnotationService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.commentChanged
        .pipe(
          tap(() => this.setIsDirty(true)),
          debounceTime(5000),
          distinctUntilChanged()
        )
        .subscribe(() => {
          this.saveComment();
        })
    );
  }

  ngOnDestroy() {
    if (this.isDirty) {
      this.saveComment();
    }
    this.subscriptions.unsubscribe();
  }

  saveComment() {
    const annotation = this.AnnotationService.createAnnotation(
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
      { value: this.comment },
      new Date().getTime()
    );
    this.AnnotationService.saveAnnotation(annotation).then(() => this.setIsDirty(false));
  }

  setIsDirty(isDirty: boolean) {
    this.isDirty = isDirty;
  }
}
