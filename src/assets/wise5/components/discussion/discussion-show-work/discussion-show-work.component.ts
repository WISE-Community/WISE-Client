import { Component, Input } from '@angular/core';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { DiscussionService } from '../discussionService';

@Component({
  selector: 'discussion-show-work',
  templateUrl: 'discussion-show-work.component.html',
  styleUrls: ['discussion-show-work.component.scss']
})
export class DiscussionShowWorkComponent extends ComponentShowWorkDirective {
  @Input()
  workgroupId: any;

  topLevelResponses: any = {};
  classResponses: any[] = [];
  responsesMap: any = {};
  retrievedClassmateResponses: boolean = false;
  studentText: string = $localize`Student`;

  constructor(
    private AnnotationService: AnnotationService,
    private ConfigService: ConfigService,
    private DiscussionService: DiscussionService,
    protected ProjectService: ProjectService
  ) {
    super(ProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.workgroupId = parseInt(this.workgroupId);
    this.setStudentWork();
  }

  setStudentWork(): void {
    const componentIds = this.getGradingComponentIds();
    const componentStates = this.DiscussionService.getPostsAssociatedWithComponentIdsAndWorkgroupId(
      componentIds,
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
  getInappropriateFlagAnnotationsByComponentStates(componentStates = []) {
    const annotations = [];
    for (const componentState of componentStates) {
      const latestInappropriateFlagAnnotation = this.AnnotationService.getLatestAnnotationByStudentWorkIdAndType(
        componentState.id,
        'inappropriateFlag'
      );
      if (latestInappropriateFlagAnnotation != null) {
        annotations.push(latestInappropriateFlagAnnotation);
      }
    }
    return annotations;
  }

  getGradingComponentIds(): string[] {
    const connectedComponentIds = [this.componentId];
    if (this.componentContent.connectedComponents != null) {
      for (const connectedComponent of this.componentContent.connectedComponents) {
        connectedComponentIds.push(connectedComponent.componentId);
      }
    }
    return connectedComponentIds;
  }

  setClassResponses(componentStates: any[], annotations: any[] = []): void {
    const isStudentMode = false;
    this.classResponses = this.DiscussionService.getClassResponses(
      componentStates,
      annotations,
      isStudentMode
    );
    this.responsesMap = this.DiscussionService.getResponsesMap(this.classResponses);
    const isGradingMode = true;
    this.topLevelResponses = this.DiscussionService.getLevel1Responses(
      this.classResponses,
      this.componentId,
      this.workgroupId,
      isGradingMode
    );
    this.retrievedClassmateResponses = true;
  }

  getUserIdsDisplay(workgroupId: number): string {
    const userIdsDisplay = [];
    for (const userId of this.ConfigService.getUserIdsByWorkgroupId(workgroupId)) {
      userIdsDisplay.push(`${this.studentText} ${userId}`);
    }
    return userIdsDisplay.join(', ');
  }

  /**
   * The teacher has clicked the delete button to delete a post. We won't actually delete the
   * student work, we'll just create an inappropriate flag annotation which prevents the students in
   * the class from seeing the post.
   * @param componentState the student component state the teacher wants to delete.
   */
  deleteButtonClicked(componentState: any): void {
    const toWorkgroupId = componentState.workgroupId;
    const userInfo = this.ConfigService.getUserInfoByWorkgroupId(toWorkgroupId);
    const periodId = userInfo.periodId;
    const teacherUserInfo = this.ConfigService.getMyUserInfo();
    const fromWorkgroupId = teacherUserInfo.workgroupId;
    const runId = this.ConfigService.getRunId();
    const nodeId = this.nodeId;
    const componentId = this.componentId;
    const studentWorkId = componentState.id;
    const data = {
      action: 'Delete'
    };
    const annotation = this.AnnotationService.createInappropriateFlagAnnotation(
      runId,
      periodId,
      nodeId,
      componentId,
      fromWorkgroupId,
      toWorkgroupId,
      studentWorkId,
      data
    );
    this.AnnotationService.saveAnnotation(annotation).then(() => {
      const componentStates = this.DiscussionService.getPostsAssociatedWithComponentIdsAndWorkgroupId(
        this.getGradingComponentIds(),
        this.workgroupId
      );
      const annotations = this.getInappropriateFlagAnnotationsByComponentStates(componentStates);
      this.setClassResponses(componentStates, annotations);
    });
  }

  /**
   * The teacher has clicked the 'Undo Delete' button to undo a previous deletion of a post. This
   * function will create an inappropriate flag annotation with the action set to 'Undo Delete'.
   * This will make the post visible to the students.
   * @param componentState the student component state the teacher wants to show again.
   */
  undoDeleteButtonClicked(componentState: any): any {
    const toWorkgroupId = componentState.workgroupId;
    const userInfo = this.ConfigService.getUserInfoByWorkgroupId(toWorkgroupId);
    const periodId = userInfo.periodId;
    const teacherUserInfo = this.ConfigService.getMyUserInfo();
    const fromWorkgroupId = teacherUserInfo.workgroupId;
    const runId = this.ConfigService.getRunId();
    const nodeId = this.nodeId;
    const componentId = this.componentId;
    const studentWorkId = componentState.id;
    const data = {
      action: 'Undo Delete'
    };
    const annotation = this.AnnotationService.createInappropriateFlagAnnotation(
      runId,
      periodId,
      nodeId,
      componentId,
      fromWorkgroupId,
      toWorkgroupId,
      studentWorkId,
      data
    );
    this.AnnotationService.saveAnnotation(annotation).then(() => {
      const componentStates = this.DiscussionService.getPostsAssociatedWithComponentIdsAndWorkgroupId(
        this.getGradingComponentIds(),
        this.workgroupId
      );
      const annotations = this.getInappropriateFlagAnnotationsByComponentStates(componentStates);
      this.setClassResponses(componentStates, annotations);
    });
  }
}
