import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { CRaterService } from '../../../services/cRaterService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';

@Component({
  selector: 'edit-open-response-advanced',
  templateUrl: 'edit-open-response-advanced.component.html',
  styleUrls: ['edit-open-response-advanced.component.scss']
})
export class EditOpenResponseAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['OpenResponse'];
  cRaterItemIdIsValid: boolean = null;
  isVerifyingCRaterItemId: boolean = false;
  nodeIds: string[] = [];
  useCustomCompletionCriteria: boolean = false;

  constructor(
    protected CRaterService: CRaterService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    protected TeacherProjectService: TeacherProjectService,
    protected UtilService: UtilService
  ) {
    super(NodeService, NotebookService, TeacherProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.authoringComponentContent.completionCriteria != null) {
      this.useCustomCompletionCriteria = true;
    }
    this.nodeIds = this.TeacherProjectService.getFlattenedProjectAsNodeIds();
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

  scoringRuleUpClicked(index: number): void {
    if (
      this.authoringComponentContent.cRater != null &&
      this.authoringComponentContent.cRater.scoringRules != null
    ) {
      this.UtilService.moveObjectUp(this.authoringComponentContent.cRater.scoringRules, index);
      this.componentChanged();
    }
  }

  scoringRuleDownClicked(index: number): void {
    if (
      this.authoringComponentContent.cRater != null &&
      this.authoringComponentContent.cRater.scoringRules != null
    ) {
      this.UtilService.moveObjectDown(this.authoringComponentContent.cRater.scoringRules, index);
      this.componentChanged();
    }
  }

  scoringRuleDeleteClicked(index: number): void {
    if (
      this.authoringComponentContent.cRater != null &&
      this.authoringComponentContent.cRater.scoringRules != null
    ) {
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
  }

  verifyCRaterItemId(itemId: string): void {
    this.cRaterItemIdIsValid = null;
    this.isVerifyingCRaterItemId = true;
    this.CRaterService.makeCRaterVerifyRequest(itemId).then((isValid) => {
      this.isVerifyingCRaterItemId = false;
      this.cRaterItemIdIsValid = isValid;
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

  multipleAttemptScoringRuleUpClicked(index: number): void {
    if (
      this.authoringComponentContent.cRater != null &&
      this.authoringComponentContent.cRater.multipleAttemptScoringRules != null
    ) {
      this.UtilService.moveObjectUp(
        this.authoringComponentContent.cRater.multipleAttemptScoringRules,
        index
      );
      this.componentChanged();
    }
  }

  multipleAttemptScoringRuleDownClicked(index: number): void {
    if (
      this.authoringComponentContent.cRater != null &&
      this.authoringComponentContent.cRater.multipleAttemptScoringRules != null
    ) {
      this.UtilService.moveObjectDown(
        this.authoringComponentContent.cRater.multipleAttemptScoringRules,
        index
      );
      this.componentChanged();
    }
  }

  multipleAttemptScoringRuleDeleteClicked(index: number): void {
    if (
      this.authoringComponentContent.cRater != null &&
      this.authoringComponentContent.cRater.multipleAttemptScoringRules != null
    ) {
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

  notificationUpClicked(index: number): void {
    if (
      this.authoringComponentContent.notificationSettings != null &&
      this.authoringComponentContent.notificationSettings.notifications != null
    ) {
      this.UtilService.moveObjectUp(
        this.authoringComponentContent.notificationSettings.notifications,
        index
      );
      this.componentChanged();
    }
  }

  notificationDownClicked(index: number): void {
    if (
      this.authoringComponentContent.notificationSettings != null &&
      this.authoringComponentContent.notificationSettings.notifications != null
    ) {
      this.UtilService.moveObjectDown(
        this.authoringComponentContent.notificationSettings.notifications,
        index
      );
      this.componentChanged();
    }
  }

  notificationDeleteClicked(index: number): void {
    if (
      this.authoringComponentContent.notificationSettings != null &&
      this.authoringComponentContent.notificationSettings.notifications != null
    ) {
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

  moveCompletionCriteriaUp(index: number): void {
    this.UtilService.moveObjectUp(
      this.authoringComponentContent.completionCriteria.criteria,
      index
    );
    this.componentChanged();
  }

  moveCompletionCriteriaDown(index: number): void {
    this.UtilService.moveObjectDown(
      this.authoringComponentContent.completionCriteria.criteria,
      index
    );
    this.componentChanged();
  }

  deleteCompletionCriteria(index: number): void {
    if (confirm($localize`Are you sure you want to delete this completion criteria?`)) {
      this.authoringComponentContent.completionCriteria.criteria.splice(index, 1);
      this.componentChanged();
    }
  }

  getComponentsByNodeId(nodeId: string): any[] {
    return this.TeacherProjectService.getComponentsByNodeId(nodeId);
  }

  isApplicationNode(nodeId: string): boolean {
    return this.TeacherProjectService.isApplicationNode(nodeId);
  }

  getNodePositionAndTitleByNodeId(nodeId: string): string {
    return this.TeacherProjectService.getNodePositionAndTitleByNodeId(nodeId);
  }
}
