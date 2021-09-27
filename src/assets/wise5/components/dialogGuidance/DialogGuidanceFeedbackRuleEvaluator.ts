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
      if (this.satisfiesRule(response, Object.assign(new FeedbackRule(), feedbackRule))) {
        return feedbackRule;
      }
    }
    return this.getDefaultRule(this.component.componentContent.feedbackRules);
  }

  private satisfiesRule(response: CRaterResponse, feedbackRule: FeedbackRule): boolean {
    return (
      this.satisfiesFinalSubmitRule(feedbackRule) ||
      this.satisfiesSecondToLastSubmitRule(feedbackRule) ||
      (!this.isSpecialRule(feedbackRule) && this.satisfiesSpecificRule(response, feedbackRule))
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

  private isSpecialRule(feedbackRule: FeedbackRule): boolean {
    return ['isFinalSubmit', 'isSecondToLastSubmit'].includes(feedbackRule.expression);
  }

  private satisfiesSpecificRule(response: CRaterResponse, feedbackRule: FeedbackRule): boolean {
    const postfixExpression = feedbackRule.getPostfixExpression();
    const termStack = [];
    for (const term of postfixExpression) {
      if (FeedbackRule.isOperand(term)) {
        termStack.push(term);
      } else {
        this.evaluateOperator(term, termStack, response);
      }
    }
    if (termStack.length === 1) {
      return this.evaluateTerm(termStack.pop(), response);
    }
    return true;
  }

  private evaluateOperator(term: string, termStack: string[], response: CRaterResponse) {
    if (this.evaluateOperatorExpression(term, termStack, response)) {
      termStack.push('true');
    } else {
      termStack.push('false');
    }
  }

  private evaluateOperatorExpression(
    term: string,
    termStack: string[],
    response: CRaterResponse
  ): boolean {
    const term1 = termStack.pop();
    const term2 = termStack.pop();
    return (
      (term === '&&' && this.evaluateAndExpression(term1, term2, response)) ||
      (term === '||' && this.evaluateOrExpression(term1, term2, response))
    );
  }

  private evaluateAndExpression(term1: string, term2: string, response: CRaterResponse): boolean {
    return this.evaluateTerm(term1, response) && this.evaluateTerm(term2, response);
  }

  private evaluateOrExpression(term1: string, term2: string, response: CRaterResponse): boolean {
    return this.evaluateTerm(term1, response) || this.evaluateTerm(term2, response);
  }

  private evaluateTerm(term: string, response: CRaterResponse): boolean {
    return term === 'true' || response.getDetectedIdeaNames().includes(term);
  }

  private getDefaultRule(feedbackRules: FeedbackRule[]): FeedbackRule {
    return feedbackRules.find((rule) => FeedbackRule.isDefaultRule(rule));
  }
}
