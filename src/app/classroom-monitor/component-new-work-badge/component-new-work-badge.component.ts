import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnnotationService } from '../../../assets/wise5/services/annotationService';
import { TeacherDataService } from '../../../assets/wise5/services/teacherDataService';
import { Annotation } from '../../../assets/wise5/common/Annotation';

@Component({
  selector: 'component-new-work-badge',
  template: `<span *ngIf="hasNewWork" class="badge badge--info" i18n>New</span>`
})
export class ComponentNewWorkBadgeComponent {
  annotationSavedToServerSubscription: Subscription;

  @Input()
  componentId: string;

  hasNewWork: boolean = false;

  @Input()
  nodeId: string;

  @Input()
  workgroupId: number;

  constructor(
    private AnnotationService: AnnotationService,
    private TeacherDataService: TeacherDataService
  ) {}

  ngOnInit() {
    this.checkHasNewWork();
    this.annotationSavedToServerSubscription = this.AnnotationService.annotationSavedToServer$.subscribe(
      (annotation: Annotation) => {
        if (annotation.nodeId === this.nodeId && annotation.componentId === this.componentId) {
          this.checkHasNewWork();
        }
      }
    );
  }

  ngOnDestroy() {
    this.annotationSavedToServerSubscription.unsubscribe();
  }

  checkHasNewWork() {
    const latestComponentState = this.TeacherDataService.getLatestComponentStateByWorkgroupIdNodeIdAndComponentId(
      this.workgroupId,
      this.nodeId,
      this.componentId
    );
    const latestAnnotations = this.AnnotationService.getLatestComponentAnnotations(
      this.nodeId,
      this.componentId,
      this.workgroupId,
      null,
      'comment'
    );
    if (latestComponentState) {
      let latestTeacherComment = null;
      if (latestAnnotations && latestAnnotations.comment) {
        latestTeacherComment = latestAnnotations.comment;
      }
      let latestTeacherScore = null;
      if (latestAnnotations && latestAnnotations.score) {
        if (latestAnnotations.score.type !== 'autoScore') {
          latestTeacherScore = latestAnnotations.score;
        }
      }
      const commentSaveTime = latestTeacherComment ? latestTeacherComment.serverSaveTime : 0;
      const scoreSaveTime = latestTeacherScore ? latestTeacherScore.serverSaveTime : 0;
      let latestTeacherAnnotationTime = 0;
      if (commentSaveTime >= scoreSaveTime) {
        latestTeacherAnnotationTime = commentSaveTime;
      } else if (scoreSaveTime > commentSaveTime) {
        latestTeacherAnnotationTime = scoreSaveTime;
      }
      let latestComponentStateTime = latestComponentState.serverSaveTime;
      if (latestComponentStateTime > latestTeacherAnnotationTime) {
        this.hasNewWork = true;
      }
    }
  }
}
