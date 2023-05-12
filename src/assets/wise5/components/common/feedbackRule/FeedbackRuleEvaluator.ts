import { FeedbackRuleComponent } from '../../feedbackRule/FeedbackRuleComponent';
import { CRaterResponse } from '../cRater/CRaterResponse';
import { FeedbackRule } from './FeedbackRule';
import { FeedbackRuleExpression } from './FeedbackRuleExpression';
import { TermEvaluator } from './TermEvaluator/TermEvaluator';
import { TermEvaluatorFactory } from './TermEvaluator/TermEvaluatorFactory';

export class FeedbackRuleEvaluator<T extends CRaterResponse | CRaterResponse[]> {
  defaultFeedback = $localize`Thanks for submitting your response.`;
  protected factory = new TermEvaluatorFactory();

  constructor(protected component: FeedbackRuleComponent) {}

  getFeedbackRule(response: T): FeedbackRule {
    for (const feedbackRule of this.component.getFeedbackRules()) {
      if (this.satisfiesRule(response, Object.assign(new FeedbackRule(), feedbackRule))) {
        return feedbackRule;
      }
    }
    return this.getDefaultRule(this.component.getFeedbackRules());
  }

  protected satisfiesRule(response: T, feedbackRule: FeedbackRule): boolean {
    return this.isSpecialRule(feedbackRule)
      ? this.satisfiesSpecialRule(response, feedbackRule)
      : this.satisfiesSpecificRule(response, feedbackRule);
  }

  private satisfiesSpecialRule(response: T, feedbackRule: FeedbackRule): boolean {
    return (
      this.satisfiesNonScorableRule(response, feedbackRule) ||
      this.satisfiesFinalSubmitRule(response, feedbackRule) ||
      this.satisfiesSecondToLastSubmitRule(response, feedbackRule)
    );
  }

  protected satisfiesFinalSubmitRule(response: T, feedbackRule: FeedbackRule): boolean {
    return (
      this.hasMaxSubmitAndIsFinalSubmitRule(feedbackRule) &&
      this.component.hasMaxSubmitCountAndUsedAllSubmits((response as CRaterResponse).submitCounter)
    );
  }

  protected hasMaxSubmitAndIsFinalSubmitRule(feedbackRule: FeedbackRule): boolean {
    return this.component.hasMaxSubmitCount() && FeedbackRule.isFinalSubmitRule(feedbackRule);
  }

  protected satisfiesSecondToLastSubmitRule(response: T, feedbackRule: FeedbackRule): boolean {
    return (
      this.hasMaxSubmitAndIsSecondToLastSubmitRule(feedbackRule) &&
      this.isSecondToLastSubmit((response as CRaterResponse).submitCounter)
    );
  }

  protected hasMaxSubmitAndIsSecondToLastSubmitRule(feedbackRule: FeedbackRule): boolean {
    return (
      this.component.hasMaxSubmitCount() && FeedbackRule.isSecondToLastSubmitRule(feedbackRule)
    );
  }

  protected isSecondToLastSubmit(submitCounter: number): boolean {
    return this.component.getNumberOfSubmitsLeft(submitCounter) === 1;
  }

  protected satisfiesNonScorableRule(response: T, feedbackRule: FeedbackRule): boolean {
    return (
      feedbackRule.expression === 'isNonScorable' && (response as CRaterResponse).isNonScorable()
    );
  }

  private isSpecialRule(feedbackRule: FeedbackRule): boolean {
    return ['isFinalSubmit', 'isSecondToLastSubmit', 'isNonScorable'].includes(
      feedbackRule.expression
    );
  }

  private satisfiesSpecificRule(response: T, feedbackRule: FeedbackRule): boolean {
    const termStack = [];
    for (const term of feedbackRule.getPostfixExpression()) {
      if (FeedbackRuleExpression.isOperand(term)) {
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

  private evaluateOperator(operator: string, termStack: string[], response: T) {
    if (this.evaluateOperatorExpression(operator, termStack, response)) {
      termStack.push('true');
    } else {
      termStack.push('false');
    }
  }

  private evaluateOperatorExpression(operator: string, termStack: string[], response: T): boolean {
    if (['&&', '||'].includes(operator)) {
      return this.evaluateAndOrExpression(operator, termStack, response);
    } else {
      return this.evaluateNotExpression(termStack, response);
    }
  }

  private evaluateAndOrExpression(operator: string, termStack: string[], response: T): boolean {
    const term1 = termStack.pop();
    const term2 = termStack.pop();
    return operator === '&&'
      ? this.evaluateTerm(term1, response) && this.evaluateTerm(term2, response)
      : this.evaluateTerm(term1, response) || this.evaluateTerm(term2, response);
  }

  private evaluateNotExpression(termStack: string[], response: T): boolean {
    return !this.evaluateTerm(termStack.pop(), response);
  }

  protected evaluateTerm(term: string, response: T): boolean {
    const evaluator: TermEvaluator = this.factory.getTermEvaluator(term);
    return evaluator.evaluate(response as CRaterResponse);
  }

  protected getDefaultRule(feedbackRules: FeedbackRule[]): FeedbackRule {
    return (
      feedbackRules.find((rule) => FeedbackRule.isDefaultRule(rule)) ||
      Object.assign(new FeedbackRule(), {
        id: 'default',
        expression: 'isDefault',
        feedback: this.component.isMultipleFeedbackTextsForSameRuleAllowed()
          ? [this.defaultFeedback]
          : this.defaultFeedback
      })
    );
  }
}
