import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { CRaterService } from '../../../services/cRaterService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { OpenResponseContent } from '../OpenResponseContent';

@Component({
  selector: 'edit-open-response-advanced',
  templateUrl: 'edit-open-response-advanced.component.html',
  styleUrls: ['edit-open-response-advanced.component.scss']
})
export class EditOpenResponseAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['OpenResponse'];
  authoringComponentContent: OpenResponseContent;
  cRaterItemIdIsValid: boolean = null;
  initialFeedbackRules = [
    {
      id: 'isDefault',
      expression: 'isDefault',
      feedback: [$localize`Default feedback`]
    }
  ];
  isVerifyingCRaterItemId: boolean = false;
  nodeIds: string[] = [];
  useCustomCompletionCriteria: boolean = false;

  constructor(
    protected cRaterService: CRaterService,
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    protected teacherProjectService: TeacherProjectService
  ) {
    super(nodeService, notebookService, teacherProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.authoringComponentContent.completionCriteria != null) {
      this.useCustomCompletionCriteria = true;
    }
    this.nodeIds = this.teacherProjectService.getFlattenedProjectAsNodeIds();
  }

  enableCRaterClicked(): void {
    if (this.authoringComponentContent.enableCRater) {
      if (this.authoringComponentContent.cRater == null) {
        this.authoringComponentContent.cRater = this.createCRaterObject();
      }
      this.setShowSubmitButtonValue(true);
    } else {
      this.setShowSubmitButtonValue(false);
    }
    this.componentChanged();
  }

  createCRaterObject() {
    return {
      itemType: 'CRATER',
      itemId: '',
      scoreOn: 'submit',
      showScore: true,
      showFeedback: true,
      scoringRules: [],
      feedback: {
        enabled: false,
        rules: this.initialFeedbackRules
      },
      enableMultipleAttemptScoringRules: false,
      multipleAttemptScoringRules: []
    };
  }

  addScoringRule(): void {
    if (
      this.authoringComponentContent.cRater != null &&
      this.authoringComponentContent.cRater.scoringRules != null
    ) {
      this.authoringComponentContent.cRater.scoringRules.push(this.createScoringRule());
      this.componentChanged();
    }
  }

  createScoringRule() {
    return {
      score: '',
      feedbackText: ''
    };
  }

  scoringRuleDeleteClicked(index: number): void {
    const scoringRule = this.authoringComponentContent.cRater.scoringRules[index];
    const score = scoringRule.score;
    const feedbackText = scoringRule.feedbackText;
    const answer = confirm(
      $localize`Are you sure you want to delete this scoring rule?\n\nScore: ${score}\n\nFeedback Text: ${feedbackText}`
    );
    if (answer) {
      this.authoringComponentContent.cRater.scoringRules.splice(index, 1);
      this.componentChanged();
    }
  }

  verifyCRaterItemId(itemId: string): void {
    this.cRaterItemIdIsValid = null;
    this.isVerifyingCRaterItemId = true;
    this.cRaterService.makeCRaterVerifyRequest(itemId).then((response: any) => {
      this.isVerifyingCRaterItemId = false;
      this.cRaterItemIdIsValid = response.available;
    });
  }

  addMultipleAttemptScoringRule(): void {
    if (
      this.authoringComponentContent.cRater != null &&
      this.authoringComponentContent.cRater.multipleAttemptScoringRules != null
    ) {
      this.authoringComponentContent.cRater.multipleAttemptScoringRules.push(
        this.createMultipleAttemptScoringRule()
      );
      this.componentChanged();
    }
  }

  createMultipleAttemptScoringRule(): any {
    return {
      scoreSequence: ['', ''],
      feedbackText: ''
    };
  }

  multipleAttemptScoringRuleDeleteClicked(index: number): void {
    const multipleAttemptScoringRule = this.authoringComponentContent.cRater
      .multipleAttemptScoringRules[index];
    const scoreSequence = multipleAttemptScoringRule.scoreSequence;
    let previousScore = '';
    let currentScore = '';
    if (scoreSequence != null) {
      previousScore = scoreSequence[0];
      currentScore = scoreSequence[1];
    }
    const feedbackText = multipleAttemptScoringRule.feedbackText;
    const answer = confirm(
      $localize`Are you sure you want to delete this multiple attempt scoring rule?\n\nPrevious Score: ${previousScore}\n\nCurrent Score: ${currentScore}\n\nFeedback Text: ${feedbackText}`
    );
    if (answer) {
      this.authoringComponentContent.cRater.multipleAttemptScoringRules.splice(index, 1);
      this.componentChanged();
    }
  }

  addNotification(): void {
    if (
      this.authoringComponentContent.notificationSettings != null &&
      this.authoringComponentContent.notificationSettings.notifications != null
    ) {
      this.authoringComponentContent.notificationSettings.notifications.push(
        this.createNotification()
      );
      this.componentChanged();
    }
  }

  createNotification(): any {
    return {
      notificationType: 'CRaterResult',
      enableCriteria: {
        scoreSequence: ['', '']
      },
      isAmbient: false,
      dismissCode: 'apple',
      isNotifyTeacher: true,
      isNotifyStudent: true,
      notificationMessageToStudent:
        '{{username}}, ' +
        $localize`you got a score of` +
        ' {{score}}. ' +
        $localize`Please talk to your teacher` +
        '.',
      notificationMessageToTeacher: '{{username}} ' + $localize`got a score of` + ' {{score}}.'
    };
  }

  notificationDeleteClicked(index: number): void {
    const notification = this.authoringComponentContent.notificationSettings.notifications[index];
    const scoreSequence = notification.enableCriteria.scoreSequence;
    let previousScore = '';
    let currentScore = '';
    if (scoreSequence != null) {
      previousScore = scoreSequence[0];
      currentScore = scoreSequence[1];
    }
    const answer = confirm(
      $localize`Are you sure you want to delete this notification?\n\nPrevious Score: ${previousScore}\n\nCurrent Score: ${currentScore}`
    );
    if (answer) {
      this.authoringComponentContent.notificationSettings.notifications.splice(index, 1);
      this.componentChanged();
    }
  }

  enableMultipleAttemptScoringRulesClicked(): void {
    const cRater = this.authoringComponentContent.cRater;
    if (cRater != null && cRater.multipleAttemptScoringRules == null) {
      cRater.multipleAttemptScoringRules = [];
    }
    this.componentChanged();
  }

  enableNotificationsClicked(): void {
    if (this.authoringComponentContent.enableNotifications) {
      if (this.authoringComponentContent.notificationSettings == null) {
        this.authoringComponentContent.notificationSettings = {
          notifications: []
        };
      }
    }
    this.componentChanged();
  }

  /**
   * The Use Completion Criteria checkbox was clicked. We will toggle the completion criteria in the
   * component content.
   */
  useCustomCompletionCriteriaClicked(event: any): void {
    if (this.useCustomCompletionCriteria) {
      // The completion criteria is currently enabled and the author is trying to disable it
      if (confirm($localize`Are you sure you want to delete the custom completion criteria?`)) {
        delete this.authoringComponentContent.completionCriteria;
      } else {
        event.preventDefault();
      }
    } else {
      // The completion criteria is currently disabled and the author is trying to enable it
      if (this.authoringComponentContent.completionCriteria == null) {
        this.authoringComponentContent.completionCriteria = this.createCompletionCriteria();
      }
    }
    this.componentChanged();
  }

  createCompletionCriteria() {
    return {
      criteria: [],
      inOrder: true
    };
  }

  addCompletionCriteria(): void {
    const newCompletionCriteria = {
      nodeId: this.nodeId,
      componentId: this.componentId,
      name: 'isSubmitted'
    };
    this.authoringComponentContent.completionCriteria.criteria.push(newCompletionCriteria);
    this.componentChanged();
  }

  deleteCompletionCriteria(index: number): void {
    if (confirm($localize`Are you sure you want to delete this completion criteria?`)) {
      this.authoringComponentContent.completionCriteria.criteria.splice(index, 1);
      this.componentChanged();
    }
  }

  getComponents(nodeId: string): any[] {
    return this.teacherProjectService.getComponents(nodeId);
  }

  isApplicationNode(nodeId: string): boolean {
    return this.teacherProjectService.isApplicationNode(nodeId);
  }

  getNodePositionAndTitle(nodeId: string): string {
    return this.teacherProjectService.getNodePositionAndTitle(nodeId);
  }

  setFeedbackEnabled(feedbackEnabled: boolean): void {
    this.initializeFeedback();
    this.authoringComponentContent.cRater.feedback.enabled = feedbackEnabled;
    this.componentChanged();
  }

  private initializeFeedback(): void {
    if (!this.authoringComponentContent.cRater.feedback) {
      this.authoringComponentContent.cRater.feedback = {
        enabled: false,
        rules: this.initialFeedbackRules
      };
    }
  }
}
