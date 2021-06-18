'use strict';

import { AnnotationService } from '../../../../services/annotationService';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import * as angular from 'angular';
import { Directive } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive()
class ComponentGradingController {
  $translate: any;
  annotationId: number;
  canAuthorProject: boolean;
  canGradeStudentWork: boolean;
  comment: string;
  componentId: string;
  componentStateId: number;
  componentStates: any;
  edit: boolean;
  fromWorkgroupId: number;
  latestAnnotations: any;
  latestAnnotationTime: any;
  nodeId: string;
  periodId: number;
  runId: number;
  score: number;
  showAllAnnotations: boolean;
  toWorkgroupId: number;
  annotationSavedToServerSubscription: Subscription;

  static $inject = [
    '$filter',
    '$scope',
    'AnnotationService',
    'ConfigService',
    'TeacherDataService'
  ];
  constructor(
    $filter: any,
    private $scope: any,
    private AnnotationService: AnnotationService,
    private ConfigService: ConfigService,
    private TeacherDataService: TeacherDataService
  ) {
    this.$translate = $filter('translate');

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

    this.$scope.$on('$destroy', () => {
      this.ngOnDestroy();
    });
  }

  ngOnDestroy() {
    this.annotationSavedToServerSubscription.unsubscribe();
  }

  $onInit() {
    this.runId = this.ConfigService.getRunId();
    const permissions = this.ConfigService.getPermissions();
    this.canGradeStudentWork = permissions.canGradeStudentWork;
    this.canAuthorProject = permissions.canAuthorProject;
    let toUserInfo = this.ConfigService.getUserInfoByWorkgroupId(this.toWorkgroupId);
    if (toUserInfo) {
      this.periodId = toUserInfo.periodId;
    }
  }

  $onChanges(changes) {
    this.componentStates = this.TeacherDataService.getComponentStatesByWorkgroupIdAndComponentId(
      this.toWorkgroupId,
      this.componentId
    );

    this.processAnnotations();
  }

  processAnnotations() {
    if (this.showAllAnnotations) {
      // we want to show all the latest annotation types (both teacher- and auto-generated)
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
      // we only want to show the latest score and comment annotations (either teacher- or auto-generated)
      this.latestAnnotations = this.AnnotationService.getLatestComponentAnnotations(
        this.nodeId,
        this.componentId,
        this.toWorkgroupId
      );

      if (this.latestAnnotations && this.latestAnnotations.comment) {
        let latestComment = this.latestAnnotations.comment;
        if (latestComment.type === 'comment') {
          this.comment = latestComment.data.value;
        }
      }

      if (this.latestAnnotations && this.latestAnnotations.score) {
        this.score = this.latestAnnotations.score.data.value;
      }

      this.latestAnnotationTime = this.getLatestAnnotationTime();
    }
  }

  /**
   * Returns true if the latest comment is an auto comment and it's
   * studentWorkId matches the latest component state's id
   */
  showAutoComment() {
    let result = false;
    if (this.latestAnnotations) {
      let latestComment = this.latestAnnotations.comment;
      if (latestComment && latestComment.type === 'autoComment') {
        let n = this.componentStates.length;
        if (n > 0) {
          let latestComponentState = this.componentStates[n - 1];
          if (latestComponentState.id === latestComment.studentWorkId) {
            result = true;
          }
        }
      }
    }

    return result;
  }

  /**
   * Returns true if there are both teacher and auto annotations for this component state
   */
  hasTeacherAndAutoAnnotations() {
    return (
      (this.latestAnnotations.score || this.latestAnnotations.comment) &&
      (this.latestAnnotations.autoScore || this.latestAnnotations.autoComment)
    );
  }

  /**
   * Returns true if there are any teacher annotations for this component state
   */
  hasTeacherAnnotations() {
    return this.latestAnnotations.score || this.latestAnnotations.comment;
  }

  /**
   * Returns true if there are any auto annotations for this component state
   */
  hasAutoAnnotations() {
    return this.latestAnnotations.autoScore || this.latestAnnotations.autoComment;
  }

  /**
   * Returns true if there are no annotations for this component state
   */
  hasNoAnnotations() {
    return (
      !this.latestAnnotations.score &&
      !this.latestAnnotations.comment &&
      !this.latestAnnotations.autoScore &&
      !this.latestAnnotations.autoComment
    );
  }

  /**
   * Get the most recent annotation (from the current score and comment annotations)
   * @return Object (latest annotation)
   */
  getLatestAnnotation() {
    let latest = null;
    let latestComment = this.latestAnnotations.comment;
    let latestScore = this.latestAnnotations.score;

    if (latestComment || latestScore) {
      let commentSaveTime = latestComment ? latestComment.serverSaveTime : 0;
      let scoreSaveTime = latestScore ? latestScore.serverSaveTime : 0;

      if (commentSaveTime >= scoreSaveTime) {
        latest = latestComment;
      } else if (scoreSaveTime > commentSaveTime) {
        latest = latestScore;
      }
    }

    return latest;
  }

  /**
   * Calculate the save time of the latest annotation
   * @return Number (latest annotation post time)
   */
  getLatestAnnotationTime() {
    let latest = this.getLatestAnnotation();
    let time = 0;

    if (latest) {
      let serverSaveTime = latest.serverSaveTime;
      time = this.ConfigService.convertToClientTimestamp(serverSaveTime);
    }

    return time;
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

const ComponentGrading = {
  bindings: {
    componentId: '<',
    componentStateId: '<',
    isDisabled: '<',
    fromWorkgroupId: '<',
    nodeId: '<',
    showAllAnnotations: '<',
    toWorkgroupId: '<'
  },
  templateUrl:
    '/assets/wise5/classroomMonitor/classroomMonitorComponents/shared/componentGrading/componentGrading.html',
  controller: ComponentGradingController
};

export default ComponentGrading;
