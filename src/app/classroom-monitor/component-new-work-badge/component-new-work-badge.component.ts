import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnnotationService } from '../../../assets/wise5/services/annotationService';
import { TeacherDataService } from '../../../assets/wise5/services/teacherDataService';
import { Annotation } from '../../../assets/wise5/common/Annotation';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'component-new-work-badge',
  standalone: true,
  template: `@if (hasNewWork) {
    <span class="badge badge--info" i18n>New</span>
    }`
})
export class ComponentNewWorkBadgeComponent {
  @Input() componentId: string;
  protected hasNewWork: boolean;
  @Input() nodeId: string;
  private subscriptions: Subscription = new Subscription();
  @Input() workgroupId: number;

  constructor(
    private annotationService: AnnotationService,
    private dataService: TeacherDataService
  ) {}

  ngOnInit(): void {
    this.checkHasNewWork();
    this.subscriptions.add(
      this.annotationService.annotationSavedToServer$.subscribe((annotation: Annotation) => {
        if (annotation.nodeId === this.nodeId && annotation.componentId === this.componentId) {
          this.checkHasNewWork();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private checkHasNewWork(): void {
    this.hasNewWork = false;
    const componentState = this.dataService.getLatestComponentStateByWorkgroupIdNodeIdAndComponentId(
      this.workgroupId,
      this.nodeId,
      this.componentId
    );
    const annotations = this.annotationService.getLatestComponentAnnotations(
      this.nodeId,
      this.componentId,
      this.workgroupId,
      'any',
      'comment'
    );
    if (componentState) {
      let teacherComment = null;
      if (annotations && annotations.comment) {
        teacherComment = annotations.comment;
      }
      let teacherScore = null;
      if (annotations && annotations.score) {
        if (annotations.score.type !== 'autoScore') {
          teacherScore = annotations.score;
        }
      }
      const commentSaveTime = teacherComment ? teacherComment.serverSaveTime : 0;
      const scoreSaveTime = teacherScore ? teacherScore.serverSaveTime : 0;
      let teacherAnnotationTime = 0;
      if (commentSaveTime >= scoreSaveTime) {
        teacherAnnotationTime = commentSaveTime;
      } else if (scoreSaveTime > commentSaveTime) {
        teacherAnnotationTime = scoreSaveTime;
      }
      let componentStateTime = componentState.serverSaveTime;
      if (componentStateTime > teacherAnnotationTime) {
        this.hasNewWork = true;
      }
    }
  }
}
