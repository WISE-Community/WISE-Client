import { Component, Input, inject } from '@angular/core';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { TeacherDiscussionService } from '../teacherDiscussionService';
import { ClassResponse } from '../class-response/class-response.component';
import { CommonModule } from '@angular/common';

@Component({
  imports: [ClassResponse, CommonModule],
  selector: 'discussion-show-work',
  styles: ['.discussion-content { padding: 16px; }'],
  templateUrl: 'discussion-show-work.component.html'
})
export class DiscussionShowWorkComponent extends ComponentShowWorkDirective {
  private annotationService = inject(AnnotationService);
  private configService = inject(ConfigService);
  private discussionService = inject(TeacherDiscussionService);
  protected topLevelResponses: any = {};
  @Input() workgroupId: any;

  ngOnInit(): void {
    super.ngOnInit();
    this.workgroupId = parseInt(this.workgroupId);
    this.setStudentWork();
  }

  private setStudentWork(): void {
    const componentStates = this.discussionService.getPostsAssociatedWithComponentIdsAndWorkgroupId(
      this.getGradingComponentIds(),
      this.workgroupId
    );
    const annotations = this.getInappropriateFlagAnnotationsByComponentStates(componentStates);
    this.setClassResponses(componentStates, annotations);
  }

  /**
   * Get the inappropriate flag annotations for these component states
   * @param componentStates an array of component states
   * @return an array of inappropriate flag annotations associated with the component states
   */
  private getInappropriateFlagAnnotationsByComponentStates(componentStates = []): any[] {
    const annotations = [];
    for (const componentState of componentStates) {
      const latestInappropriateFlagAnnotation =
        this.annotationService.getLatestAnnotationByStudentWorkIdAndType(
          componentState.id,
          'inappropriateFlag'
        );
      if (latestInappropriateFlagAnnotation != null) {
        annotations.push(latestInappropriateFlagAnnotation);
      }
    }
    return annotations;
  }

  private getGradingComponentIds(): string[] {
    const connectedComponentIds = [this.componentId];
    if (this.componentContent.connectedComponents != null) {
      for (const connectedComponent of this.componentContent.connectedComponents) {
        connectedComponentIds.push(connectedComponent.componentId);
      }
    }
    return connectedComponentIds;
  }

  private setClassResponses(componentStates: any[], annotations: any[] = []): void {
    const isStudentMode = false;
    const classResponses = this.discussionService.getClassResponses(
      componentStates,
      annotations,
      isStudentMode
    );
    const isGradingMode = true;
    this.topLevelResponses = this.discussionService.getLevel1Responses(
      classResponses,
      this.componentId,
      this.workgroupId,
      isGradingMode
    );
  }

  /**
   * The teacher has clicked the delete button to delete a post. We won't actually delete the
   * student work, we'll just create an inappropriate flag annotation which prevents the students in
   * the class from seeing the post.
   * @param componentState the student component state the teacher wants to delete.
   */
  protected hidePost(componentState: any): void {
    this.flagPost(componentState, 'Delete');
  }

  /**
   * The teacher has clicked the 'Undo Delete' button to undo a previous deletion of a post. This
   * function will create an inappropriate flag annotation with the action set to 'Undo Delete'.
   * This will make the post visible to the students.
   * @param componentState the student component state the teacher wants to show again.
   */
  protected showPost(componentState: any): void {
    this.flagPost(componentState, 'Undo Delete');
  }

  private flagPost(componentState: any, action: 'Delete' | 'Undo Delete'): void {
    const toWorkgroupId = componentState.workgroupId;
    const userInfo = this.configService.getUserInfoByWorkgroupId(toWorkgroupId);
    const periodId = userInfo.periodId;
    const teacherUserInfo = this.configService.getMyUserInfo();
    const fromWorkgroupId = teacherUserInfo.workgroupId;
    const runId = this.configService.getRunId();
    const nodeId = this.nodeId;
    const componentId = this.componentId;
    const studentWorkId = componentState.id;
    const data = {
      action: action
    };
    const annotation = this.annotationService.createInappropriateFlagAnnotation(
      runId,
      periodId,
      nodeId,
      componentId,
      fromWorkgroupId,
      toWorkgroupId,
      studentWorkId,
      data
    );
    this.annotationService.saveAnnotation(annotation).then(() => {
      const componentStates =
        this.discussionService.getPostsAssociatedWithComponentIdsAndWorkgroupId(
          this.getGradingComponentIds(),
          this.workgroupId
        );
      const annotations = this.getInappropriateFlagAnnotationsByComponentStates(componentStates);
      this.setClassResponses(componentStates, annotations);
    });
  }
}
