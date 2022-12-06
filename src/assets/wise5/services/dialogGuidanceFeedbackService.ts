import { Injectable } from '@angular/core';
import { FeedbackRule } from '../components/common/feedbackRule/FeedbackRule';
import { StudentDataService } from './studentDataService';
import { DialogGuidanceComponent } from '../components/dialogGuidance/DialogGuidanceComponent';

@Injectable()
export class DialogGuidanceFeedbackService {
  constructor(private studentDataService: StudentDataService) {}

  getFeedbackText(component: DialogGuidanceComponent, feedbackRule: FeedbackRule): string {
    return component.isVersion1()
      ? <string>feedbackRule.feedback
      : this.getFeedbackTextVersion2(component, feedbackRule);
  }

  private getFeedbackTextVersion2(component: DialogGuidanceComponent, feedbackRule: FeedbackRule) {
    const latestSubmitComponentState = this.studentDataService.getLatestSubmitComponentState(
      component.nodeId,
      component.id
    );
    return feedbackRule.feedback[
      this.getCountFeedbackRuleShown(latestSubmitComponentState, feedbackRule) %
        feedbackRule.feedback.length
    ];
  }

  private getCountFeedbackRuleShown(
    latestSubmitComponentState: any,
    feedbackRule: FeedbackRule
  ): number {
    return latestSubmitComponentState == null
      ? 0
      : latestSubmitComponentState.studentData.responses.filter(
          (response) => response.feedbackRuleId === feedbackRule.id
        ).length;
  }
}
