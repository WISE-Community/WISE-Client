import { CRaterResponse } from './CRaterResponse';
import { DialogGuidanceStudentComponent } from './dialog-guidance-student/dialog-guidance-student.component';
import { FeedbackRule } from './FeedbackRule';

export class DialogGuidanceFeedbackRuleEvaluator {
  component: DialogGuidanceStudentComponent;

  constructor(component: DialogGuidanceStudentComponent) {
    this.component = component;
  }

  getFeedbackRule(response: CRaterResponse): FeedbackRule {
    for (const feedbackRule of this.component.componentContent.feedbackRules) {
      if (this.satisfiesRule(response, feedbackRule)) {
        return feedbackRule;
      }
    }
    return this.getDefaultRule(this.component.componentContent.feedbackRules);
  }

  private satisfiesRule(response: CRaterResponse, feedbackRule: FeedbackRule): boolean {
    return (
      this.satisfiesFinalSubmitRule(feedbackRule) ||
      this.satisfiesSecondToLastSubmitRule(feedbackRule) ||
      this.satisfiesSpecificRule(response, feedbackRule)
    );
  }

  private satisfiesFinalSubmitRule(feedbackRule: FeedbackRule): boolean {
    return (
      this.component.hasMaxSubmitCountAndUsedAllSubmits() &&
      FeedbackRule.isFinalSubmitRule(feedbackRule)
    );
  }

  private satisfiesSecondToLastSubmitRule(feedbackRule: FeedbackRule): boolean {
    return (
      this.component.hasMaxSubmitCount() &&
      this.isSecondToLastSubmit() &&
      FeedbackRule.isSecondToLastSubmitRule(feedbackRule)
    );
  }

  private isSecondToLastSubmit(): boolean {
    return this.component.getNumberOfSubmitsLeft() === 1;
  }

  private satisfiesSpecificRule(response: CRaterResponse, feedbackRule: FeedbackRule): boolean {
    return this.arrayEquals(response.getDetectedIdeaNames(), feedbackRule.rule);
  }

  private arrayEquals(a: any[], b: any[]): boolean {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }

  private getDefaultRule(feedbackRules: FeedbackRule[]): FeedbackRule {
    return feedbackRules.find((rule) => FeedbackRule.isDefaultRule(rule));
  }
}
