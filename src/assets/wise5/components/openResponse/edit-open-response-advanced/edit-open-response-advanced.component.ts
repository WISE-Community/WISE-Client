import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditCommonAdvancedComponent } from '../../../../../app/authoring-tool/edit-common-advanced/edit-common-advanced.component';
import { EditComponentAddToNotebookButtonComponent } from '../../../../../app/authoring-tool/edit-component-add-to-notebook-button/edit-component-add-to-notebook-button.component';
import { TranslatableTextareaComponent } from '../../../authoringTool/components/translatable-textarea/translatable-textarea.component';
import { ComponentContent } from '../../../common/ComponentContent';
import { EditFeedbackRulesComponent } from '../../common/feedbackRule/edit-feedback-rules/edit-feedback-rules.component';
import { OpenResponseContent } from '../OpenResponseContent';
import { CRaterItemSelectComponent } from '../../common/cRater/crater-item-select/crater-item-select.component';
import { EditCRaterInfoComponent } from '../../common/cRater/edit-crater-info/edit-crater-info.component';
import { DEFAULT_IDEAS_SUMMARY_GROUPS } from '../../common/cRater/CRaterRubric';

@Component({
  imports: [
    TranslatableTextareaComponent,
    MatCheckbox,
    FormsModule,
    MatFormFieldModule,
    MatInput,
    MatButton,
    MatSelectModule,
    EditFeedbackRulesComponent,
    MatTooltip,
    MatIcon,
    EditComponentAddToNotebookButtonComponent,
    EditCommonAdvancedComponent,
    EditCRaterInfoComponent,
    CRaterItemSelectComponent
  ],
  styleUrl: 'edit-open-response-advanced.component.scss',
  templateUrl: 'edit-open-response-advanced.component.html'
})
export class EditOpenResponseAdvancedComponent extends EditAdvancedComponentComponent {
  protected allowedConnectedComponentTypes = ['OpenResponse'];
  componentContent: OpenResponseContent;
  private initialFeedbackRules = [
    {
      id: 'isDefault',
      expression: 'isDefault',
      feedback: [$localize`Default feedback`]
    }
  ];
  protected nodeIds: string[] = [];
  useCustomCompletionCriteria: boolean;

  ngOnInit(): void {
    super.ngOnInit();
    if (this.componentContent.completionCriteria != null) {
      this.useCustomCompletionCriteria = true;
    }
    this.nodeIds = this.teacherProjectService.getFlattenedProjectAsNodeIds();
    if (this.componentContent.enableCRater) {
      this.createCRaterAndRubricIfNull();
    }
  }

  private createCRaterAndRubricIfNull() {
    if (this.componentContent.cRater == null) {
      this.componentContent.cRater = this.createCRaterObject();
    }
    if (!this.componentContent.cRater.rubric) {
      this.componentContent.cRater.rubric = { ideas: [] };
    }
  }

  enableCRaterClicked(): void {
    if (this.componentContent.enableCRater) {
      this.createCRaterAndRubricIfNull();
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
      multipleAttemptScoringRules: [],
      rubric: {
        ideas: [],
        ideaColors: [],
        ideasSummaryGroups: DEFAULT_IDEAS_SUMMARY_GROUPS
      }
    };
  }

  addScoringRule(): void {
    if (this.componentContent.cRater != null && this.componentContent.cRater.scoringRules != null) {
      this.componentContent.cRater.scoringRules.push(this.createScoringRule());
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
    const scoringRule = this.componentContent.cRater.scoringRules[index];
    const score = scoringRule.score;
    const feedbackText = scoringRule.feedbackText;
    const answer = confirm(
      $localize`Are you sure you want to delete this scoring rule?\n\nScore: ${score}\n\nFeedback Text: ${feedbackText}`
    );
    if (answer) {
      this.componentContent.cRater.scoringRules.splice(index, 1);
      this.componentChanged();
    }
  }

  addMultipleAttemptScoringRule(): void {
    if (
      this.componentContent.cRater != null &&
      this.componentContent.cRater.multipleAttemptScoringRules != null
    ) {
      this.componentContent.cRater.multipleAttemptScoringRules.push(
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
    const multipleAttemptScoringRule =
      this.componentContent.cRater.multipleAttemptScoringRules[index];
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
      this.componentContent.cRater.multipleAttemptScoringRules.splice(index, 1);
      this.componentChanged();
    }
  }

  addNotification(): void {
    if (
      this.componentContent.notificationSettings != null &&
      this.componentContent.notificationSettings.notifications != null
    ) {
      this.componentContent.notificationSettings.notifications.push(this.createNotification());
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
    const notification = this.componentContent.notificationSettings.notifications[index];
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
      this.componentContent.notificationSettings.notifications.splice(index, 1);
      this.componentChanged();
    }
  }

  enableMultipleAttemptScoringRulesClicked(): void {
    const cRater = this.componentContent.cRater;
    if (cRater != null && cRater.multipleAttemptScoringRules == null) {
      cRater.multipleAttemptScoringRules = [];
    }
    this.componentChanged();
  }

  enableNotificationsClicked(): void {
    if (this.componentContent.enableNotifications) {
      if (this.componentContent.notificationSettings == null) {
        this.componentContent.notificationSettings = {
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
        delete this.componentContent.completionCriteria;
      } else {
        event.preventDefault();
      }
    } else {
      // The completion criteria is currently disabled and the author is trying to enable it
      if (this.componentContent.completionCriteria == null) {
        this.componentContent.completionCriteria = this.createCompletionCriteria();
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
    this.componentContent.completionCriteria.criteria.push(newCompletionCriteria);
    this.componentChanged();
  }

  deleteCompletionCriteria(index: number): void {
    if (confirm($localize`Are you sure you want to delete this completion criteria?`)) {
      this.componentContent.completionCriteria.criteria.splice(index, 1);
      this.componentChanged();
    }
  }

  getComponents(nodeId: string): ComponentContent[] {
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
    this.componentContent.cRater.feedback.enabled = feedbackEnabled;
    this.componentChanged();
  }

  private initializeFeedback(): void {
    if (!this.componentContent.cRater.feedback) {
      this.componentContent.cRater.feedback = {
        enabled: false,
        rules: this.initialFeedbackRules
      };
    }
  }
}
