'use strict';

import * as angular from 'angular';
import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { TeacherDataService } from '../../../services/teacherDataService';

@Component({
  selector: 'edit-component-annotations',
  styles: ['.disabled-text { color: gray; }'],
  templateUrl: 'edit-component-annotations.component.html'
})
export class EditComponentAnnotationsComponent {
  @Input() componentId: string;
  @Input() componentStateId: number;
  @Input() fromWorkgroupId: number;
  @Input() isDisabled: boolean;
  @Input() nodeId: string;
  @Input() showAllAnnotations: boolean;
  @Input() toWorkgroupId: number;

  annotationId: number;
  canAuthorProject: boolean;
  canGradeStudentWork: boolean;
  comment: string;
  componentStates: any;
  edit: boolean;
  latestAnnotations: any;
  periodId: number;
  runId: number;
  score: number;

  annotationSavedToServerSubscription: Subscription;

  constructor(
    private AnnotationService: AnnotationService,
    private ConfigService: ConfigService,
    private TeacherDataService: TeacherDataService
  ) {}

  ngOnInit() {
    this.runId = this.ConfigService.getRunId();
    const permissions = this.ConfigService.getPermissions();
    this.canGradeStudentWork = permissions.canGradeStudentWork;
    this.canAuthorProject = permissions.canAuthorProject;
    const toUserInfo = this.ConfigService.getUserInfoByWorkgroupId(this.toWorkgroupId);
    if (toUserInfo) {
      this.periodId = toUserInfo.periodId;
    }
    this.annotationSavedToServerSubscription = this.AnnotationService.annotationSavedToServer$.subscribe(
      ({ annotation }) => {
        // TODO: we're watching this here and in the parent component's controller; probably want to optimize!
        const annotationNodeId = annotation.nodeId;
        const annotationComponentId = annotation.componentId;
        if (this.nodeId === annotationNodeId && this.componentId === annotationComponentId) {
          this.processAnnotations();
        }
      }
    );
  }

  ngOnDestroy() {
    this.annotationSavedToServerSubscription.unsubscribe();
  }

  ngOnChanges() {
    this.componentStates = this.TeacherDataService.getComponentStatesByWorkgroupIdAndComponentId(
      this.toWorkgroupId,
      this.componentId
    );
    this.processAnnotations();
  }

  processAnnotations() {
    if (this.showAllAnnotations) {
      this.latestAnnotations = {};
      this.latestAnnotations.score = this.AnnotationService.getLatestTeacherScoreAnnotationByStudentWorkId(
        this.componentStateId
      );
      this.latestAnnotations.autoScore = this.AnnotationService.getLatestAutoScoreAnnotationByStudentWorkId(
        this.componentStateId
      );
      this.latestAnnotations.comment = this.AnnotationService.getLatestTeacherCommentAnnotationByStudentWorkId(
        this.componentStateId
      );
      this.latestAnnotations.autoComment = this.AnnotationService.getLatestAutoCommentAnnotationByStudentWorkId(
        this.componentStateId
      );
    } else {
      this.latestAnnotations = this.AnnotationService.getLatestComponentAnnotations(
        this.nodeId,
        this.componentId,
        this.toWorkgroupId
      );
      if (this.latestAnnotations && this.latestAnnotations.comment) {
        const latestComment = this.latestAnnotations.comment;
        if (latestComment.type === 'comment') {
          this.comment = latestComment.data.value;
        }
      }
      if (this.latestAnnotations && this.latestAnnotations.score) {
        this.score = this.latestAnnotations.score.data.value;
      }
    }
  }

  showAutoComment() {
    if (this.latestAnnotations) {
      const latestComment = this.latestAnnotations.comment;
      if (latestComment && latestComment.type === 'autoComment') {
        if (this.componentStates.length > 0) {
          const latestComponentState = this.componentStates[this.componentStates.length - 1];
          if (latestComponentState.id === latestComment.studentWorkId) {
            return true;
          }
        }
      }
    }
    return false;
  }

  hasTeacherAnnotations() {
    return this.latestAnnotations.score || this.latestAnnotations.comment;
  }

  hasAutoAnnotations() {
    return this.latestAnnotations.autoScore || this.latestAnnotations.autoComment;
  }

  hasTeacherAndAutoAnnotations() {
    return this.hasTeacherAnnotations() && this.hasAutoAnnotations();
  }

  hasNoAnnotations() {
    return !(this.hasTeacherAnnotations() || this.hasAutoAnnotations());
  }

  toggleEditComment() {
    this.edit = !this.edit;
    if (this.edit) {
      angular
        .element(document.querySelector(`#commentInput_${this.componentId}_${this.toWorkgroupId}`))
        .focus();
    }
  }
}
