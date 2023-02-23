'use strict';

import { Component, Input, SimpleChanges } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { WiseLinkService } from '../../../../app/services/wiseLinkService';
import { ConfigService } from '../../services/configService';
import { StudentDataService } from '../../services/studentDataService';
import { VLEProjectService } from '../../vle/vleProjectService';

@Component({
  selector: 'component-annotations',
  styleUrls: ['component-annotations.component.scss'],
  templateUrl: 'component-annotations.component.html'
})
export class ComponentAnnotationsComponent {
  @Input()
  annotations: any;

  @Input()
  maxScore: string;

  @Input()
  nodeId: string;

  @Input()
  componentId: string;

  comment: SafeHtml;
  icon: string = 'person';
  isNew: boolean;
  label: string;
  latestAnnotationTime: any = null;
  maxScoreDisplay: string;
  showComment: boolean = true;
  showScore: boolean = true;
  studentWorkSavedToServerSubscription: Subscription;

  constructor(
    private configService: ConfigService,
    private projectService: VLEProjectService,
    private studentDataService: StudentDataService,
    private wiseLinkService: WiseLinkService
  ) {}

  ngOnInit() {
    this.maxScoreDisplay = parseInt(this.maxScore) > 0 ? '/' + this.maxScore : '';
    this.studentWorkSavedToServerSubscription = this.studentDataService.studentWorkSavedToServer$.subscribe(
      (componentState) => {
        if (
          componentState.nodeId === this.nodeId &&
          componentState.componentId === this.componentId
        ) {
          this.isNew = false;
        }
      }
    );
    this.processAnnotations();
  }

  ngAfterViewInit() {
    this.processAnnotations();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.annotations.isFirstChange()) {
      this.processAnnotations();
    }
  }

  processAnnotations(): void {
    if (this.annotations.comment || this.annotations.score) {
      this.nodeId = this.getNodeId(this.annotations);
      this.componentId = this.getComponentId(this.annotations);
      this.showScore = this.isShowScore(this.annotations);
      this.showComment = this.isShowComment(this.annotations);
      if (this.showComment) {
        this.comment = this.getCommentHtml(this.annotations.comment);
      }
      this.setLabelAndIcon();
    }
    this.latestAnnotationTime = this.getLatestAnnotationTime();
  }

  getNodeId(annotations: any): string {
    return this.hasCommentAnnotation(annotations)
      ? annotations.comment.nodeId
      : annotations.score.nodeId;
  }

  getComponentId(annotations: any): string {
    return this.hasCommentAnnotation(annotations)
      ? annotations.comment.componentId
      : annotations.score.componentId;
  }

  isShowScore(annotations: any): boolean {
    return (
      this.hasScoreAnnotation(annotations) &&
      this.projectService.displayAnnotation(annotations.score)
    );
  }

  isShowComment(annotations: any): boolean {
    return (
      this.hasCommentAnnotation(annotations) &&
      this.projectService.displayAnnotation(this.annotations.comment)
    );
  }

  hasCommentAnnotation(annotations: any): boolean {
    return annotations.comment != null;
  }

  hasScoreAnnotation(annotations: any): boolean {
    return annotations.score != null;
  }

  getCommentHtml(commentAnnotation: any): SafeHtml {
    return this.wiseLinkService.generateHtmlWithWiseLink(commentAnnotation.data.value);
  }

  getLatestAnnotation() {
    let latest = null;
    if (this.annotations.comment || this.annotations.score) {
      const commentSaveTime = this.getSaveTime(this.annotations.comment);
      const scoreSaveTime = this.getSaveTime(this.annotations.score);
      if (commentSaveTime >= scoreSaveTime) {
        latest = this.annotations.comment;
      } else if (scoreSaveTime > commentSaveTime) {
        latest = this.annotations.score;
      }
    }
    return latest;
  }

  getSaveTime(annotation: any): number {
    let saveTime = null;
    if (annotation != null) {
      if (annotation.serverSaveTime != null) {
        saveTime = annotation.serverSaveTime;
      }
      if (annotation.clientSaveTime != null) {
        saveTime = annotation.clientSaveTime;
      }
    }
    return saveTime;
  }

  getLatestAnnotationTime() {
    const latest = this.getLatestAnnotation();
    if (latest) {
      return this.configService.convertToClientTimestamp(this.getSaveTime(latest));
    }
    return null;
  }

  getLatestVisitTime() {
    let nodeEvents = this.studentDataService.getEventsByNodeId(this.nodeId);
    let n = nodeEvents.length - 1;
    let visitTime = null;
    for (let i = n; i > 0; i--) {
      let event = nodeEvents[i];
      if (event.event === 'nodeExited') {
        visitTime = this.configService.convertToClientTimestamp(event.serverSaveTime);
        break;
      }
    }
    return visitTime;
  }

  getLatestSaveTime() {
    const latestState = this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    let saveTime = null;
    if (latestState) {
      saveTime = this.configService.convertToClientTimestamp(this.getSaveTime(latestState));
    }
    return saveTime;
  }

  isNewAnnotation() {
    let latestVisitTime = this.getLatestVisitTime();
    let latestSaveTime = this.getLatestSaveTime();
    let latestAnnotationTime = this.getLatestAnnotationTime();
    let isNew = true;
    if (latestVisitTime && latestVisitTime > latestAnnotationTime) {
      isNew = false;
    }
    if (latestSaveTime && latestSaveTime > latestAnnotationTime) {
      isNew = false;
    }
    return isNew;
  }

  setLabelAndIcon() {
    const latest = this.getLatestAnnotation();
    if (latest) {
      if (latest.type === 'autoComment' || latest.type === 'autoScore') {
        this.label = $localize`Feedback`;
        this.icon = 'message';
      } else {
        this.label = $localize`Teacher Feedback`;
        this.icon = 'person';
      }
    }
  }
}
