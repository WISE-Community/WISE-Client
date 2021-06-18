import { Component, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
  subscriptions: Subscription = new Subscription();

  constructor(private AnnotationService: AnnotationService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.commentChanged
        .pipe(debounceTime(5000), distinctUntilChanged())
        .subscribe((newComment) => {
          this.saveComment(newComment);
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  saveComment(comment: string) {
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
      { value: comment },
      new Date().getTime()
    );
    this.AnnotationService.saveAnnotation(annotation);
  }
}
