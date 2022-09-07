import { CRaterResponse } from './CRaterResponse';
import { DialogGuidanceStudentComponent } from './dialog-guidance-student/dialog-guidance-student.component';
import { FeedbackRule } from './FeedbackRule';
import { HasKIScoreTermEvaluator } from './TermEvaluator/HasKIScoreTermEvaluator';
import { IdeaCountTermEvaluator } from './TermEvaluator/IdeaCountTermEvaluator';
import { IdeaTermEvaluator } from './TermEvaluator/IdeaTermEvaluator';
import { TermEvaluator } from './TermEvaluator/TermEvaluator';

export class DialogGuidanceFeedbackRuleEvaluator {
  defaultFeedback = $localize`Thanks for submitting your response.`;

  constructor(private component: DialogGuidanceStudentComponent) {}

  getFeedbackRule(response: CRaterResponse): FeedbackRule {
    for (const feedbackRule of this.component.componentContent.feedbackRules) {
      if (this.satisfiesRule(response, Object.assign(new FeedbackRule(), feedbackRule))) {
        return feedbackRule;
      }
    }
    return this.getDefaultRule(this.component.componentContent.feedbackRules);
  }

  private satisfiesRule(response: CRaterResponse, feedbackRule: FeedbackRule): boolean {
    return this.isSpecialRule(feedbackRule)
      ? this.satisfiesSpecialRule(response, feedbackRule)
      : this.satisfiesSpecificRule(response, feedbackRule);
  }

  private satisfiesSpecialRule(response: CRaterResponse, feedbackRule: FeedbackRule): boolean {
    return (
      this.satisfiesNonScorableRule(response, feedbackRule) ||
      this.satisfiesFinalSubmitRule(feedbackRule) ||
      this.satisfiesSecondToLastSubmitRule(feedbackRule)
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

  private satisfiesNonScorableRule(response: CRaterResponse, feedbackRule: FeedbackRule): boolean {
    return feedbackRule.expression === 'isNonScorable' && response.isNonScorable();
  }

  private isSpecialRule(feedbackRule: FeedbackRule): boolean {
    return ['isFinalSubmit', 'isSecondToLastSubmit', 'isNonScorable'].includes(
      feedbackRule.expression
    );
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

  private evaluateOperator(operator: string, termStack: string[], response: CRaterResponse) {
    if (this.evaluateOperatorExpression(operator, termStack, response)) {
      termStack.push('true');
    } else {
      termStack.push('false');
    }
  }

  private evaluateOperatorExpression(
    operator: string,
    termStack: string[],
    response: CRaterResponse
  ): boolean {
    if (['&&', '||'].includes(operator)) {
      return this.evaluateAndOrExpression(operator, termStack, response);
    } else {
      return this.evaluateNotExpression(termStack, response);
    }
  }

  private evaluateAndOrExpression(
    operator: string,
    termStack: string[],
    response: CRaterResponse
  ): boolean {
    const term1 = termStack.pop();
    const term2 = termStack.pop();
    return operator === '&&'
      ? this.evaluateTerm(term1, response) && this.evaluateTerm(term2, response)
      : this.evaluateTerm(term1, response) || this.evaluateTerm(term2, response);
  }

  private evaluateNotExpression(termStack: string[], response: CRaterResponse): boolean {
    return !this.evaluateTerm(termStack.pop(), response);
  }

  private evaluateTerm(term: string, response: CRaterResponse): boolean {
    let evaluator: TermEvaluator;
    if (this.isHasKIScoreTerm(term)) {
      evaluator = new HasKIScoreTermEvaluator(term);
    } else if (this.isIdeaCountTerm(term)) {
      evaluator = new IdeaCountTermEvaluator(term);
    } else {
      evaluator = new IdeaTermEvaluator(term);
    }
    return evaluator.evaluate(response);
  }

  private isHasKIScoreTerm(term: string): boolean {
    return /hasKIScore\([1-5]\)/.test(term);
  }

  private isIdeaCountTerm(term: string): boolean {
    return /ideaCount(MoreThan|Equals|LessThan)\([\d+]\)/.test(term);
  }

  private getDefaultRule(feedbackRules: FeedbackRule[]): FeedbackRule {
    return (
      feedbackRules.find((rule) => FeedbackRule.isDefaultRule(rule)) ||
      Object.assign(new FeedbackRule(), {
        expression: 'isDefault',
        feedback: this.component.isVersion1() ? this.defaultFeedback : [this.defaultFeedback]
      })
    );
  }
}
