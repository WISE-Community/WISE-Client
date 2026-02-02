import { Component, Input, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { Annotation } from '../../../common/Annotation';
import { EditComponentScoreComponent } from '../edit-component-score/edit-component-score.component';
import { GradingEditComponentMaxScoreComponent } from '../grading-edit-component-max-score/grading-edit-component-max-score.component';
import { EditComponentCommentComponent } from '../edit-component-comment/edit-component-comment.component';

@Component({
  imports: [
    EditComponentCommentComponent,
    EditComponentScoreComponent,
    GradingEditComponentMaxScoreComponent
  ],
  selector: 'edit-component-annotations',
  styles: ['.disabled-text { color: gray; }'],
  templateUrl: 'edit-component-annotations.component.html'
})
export class EditComponentAnnotationsComponent {
  private annotationService = inject(AnnotationService);
  private configService = inject(ConfigService);
  private dataService = inject(TeacherDataService);

  @Input() componentId: string;
  @Input() componentStateId: number;
  @Input() fromWorkgroupId: number;
  @Input() isDisabled: boolean;
  @Input() nodeId: string;
  @Input() showAllAnnotations: boolean;
  @Input() toWorkgroupId: number;

  protected canAuthorProject: boolean;
  protected canGradeStudentWork: boolean;
  protected comment: string;
  private componentStates: any;
  protected edit: boolean;
  protected latestAnnotations: any;
  protected periodId: number;
  protected runId: number;
  private subscription: Subscription;

  ngOnInit(): void {
    this.runId = this.configService.getRunId();
    const permissions = this.configService.getPermissions();
    this.canGradeStudentWork = permissions.canGradeStudentWork;
    this.canAuthorProject = permissions.canAuthorProject;
    const toUserInfo = this.configService.getUserInfoByWorkgroupId(this.toWorkgroupId);
    if (toUserInfo) {
      this.periodId = toUserInfo.periodId;
    }
    this.subscription = this.annotationService.annotationSavedToServer$.subscribe(
      (annotation: Annotation) => {
        // TODO: we're watching this here and in the parent component's controller; probably want to optimize!
        if (annotation.nodeId === this.nodeId && annotation.componentId === this.componentId) {
          this.processAnnotations();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(): void {
    this.componentStates = this.dataService.getComponentStatesByWorkgroupIdAndComponentId(
      this.toWorkgroupId,
      this.componentId
    );
    this.processAnnotations();
  }

  private processAnnotations(): void {
    if (this.showAllAnnotations) {
      this.processAllAnnotations();
    } else {
      this.processLatestAnnotations();
    }
  }

  private processAllAnnotations(): void {
    this.latestAnnotations = {};
    this.latestAnnotations.score =
      this.annotationService.getLatestTeacherScoreAnnotationByStudentWorkId(this.componentStateId);
    this.latestAnnotations.autoScore =
      this.annotationService.getLatestAutoScoreAnnotationByStudentWorkId(this.componentStateId);
    this.latestAnnotations.comment =
      this.annotationService.getLatestTeacherCommentAnnotationByStudentWorkId(
        this.componentStateId
      );
    this.latestAnnotations.autoComment =
      this.annotationService.getLatestAutoCommentAnnotationByStudentWorkId(this.componentStateId);
  }

  private processLatestAnnotations(): void {
    this.latestAnnotations = this.annotationService.getLatestComponentAnnotations(
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
  }

  protected showAutoComment(): boolean {
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

  protected hasTeacherAnnotations(): boolean {
    return this.latestAnnotations.score || this.latestAnnotations.comment;
  }

  protected hasAutoAnnotations(): boolean {
    return this.latestAnnotations.autoScore || this.latestAnnotations.autoComment;
  }

  protected hasTeacherAndAutoAnnotations(): boolean {
    return this.hasTeacherAnnotations() && this.hasAutoAnnotations();
  }

  protected hasNoAnnotations(): boolean {
    return !(this.hasTeacherAnnotations() || this.hasAutoAnnotations());
  }

  protected toggleEditComment(): void {
    this.edit = !this.edit;
    if (this.edit) {
      document.getElementById(`commentInput_${this.componentId}_${this.toWorkgroupId}`).focus();
    }
  }
}
