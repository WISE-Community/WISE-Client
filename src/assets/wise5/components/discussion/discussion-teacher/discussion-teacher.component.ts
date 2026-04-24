import { Component, inject, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ComponentHeaderComponent } from '../../../directives/component-header/component-header.component';
import { ComponentAnnotationsComponent } from '../../../directives/componentAnnotations/component-annotations.component';
import { MatCard } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DiscussionStudent } from '../discussion-student/discussion-student.component';
import { TeacherDiscussionService } from '../teacherDiscussionService';
import { ClassResponseTeacherComponent } from '../class-response-teacher/class-response-teacher.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CdkTextareaAutosize,
    ClassResponseTeacherComponent,
    ComponentAnnotationsComponent,
    ComponentHeaderComponent,
    FormsModule,
    MatButton,
    MatCard,
    MatFormField,
    MatIcon,
    MatInput,
    NgClass
  ],
  selector: 'discussion-teacher',
  styleUrl: '../discussion-student/discussion-student.component.scss',
  templateUrl: './discussion-teacher.component.html'
})
export class DiscussionTeacherComponent extends DiscussionStudent {
  @Input() periodId: number;
  @Input() anonymizeResponses: boolean;
  studentMode: boolean = false;
  private teacherDiscussionService = inject(TeacherDiscussionService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.component) {
      this.componentId = changes.component.currentValue.id;
    }
    if (this.componentId) {
      this.renderDiscussion();
    }
  }

  protected getPeriodId(): number {
    return this.periodId;
  }

  protected isClassmateResponsesGated(): boolean {
    // allow teacher to always see all responses, no need to post to see others
    return false;
  }

  disableComponentIfNecessary(): void {
    // no need to disable the component for teacher
  }

  protected isAnonymizeResponses(): boolean {
    return this.anonymizeResponses;
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
        this.teacherDiscussionService.getPostsAssociatedWithComponentIdsAndWorkgroupId(
          this.getGradingComponentIds(),
          this.workgroupId
        );
      const annotations = this.getInappropriateFlagAnnotationsByComponentStates(componentStates);
      this.setClassResponses(componentStates, annotations);
    });
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
}
