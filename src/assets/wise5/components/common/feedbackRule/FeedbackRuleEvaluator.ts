import { FeedbackRuleComponent } from '../../feedbackRule/FeedbackRuleComponent';
import { CRaterResponse } from '../cRater/CRaterResponse';
import { FeedbackRule } from './FeedbackRule';
import { FeedbackRuleExpression } from './FeedbackRuleExpression';
import { TermEvaluator } from './TermEvaluator/TermEvaluator';
import { TermEvaluatorFactory } from './TermEvaluator/TermEvaluatorFactory';

export class FeedbackRuleEvaluator<T extends CRaterResponse[]> {
  defaultFeedback = $localize`Thanks for submitting your response.`;
  protected factory = new TermEvaluatorFactory();

  constructor(protected component: FeedbackRuleComponent) {}

  getFeedbackRule(responses: T): FeedbackRule {
    return (
      this.component
        .getFeedbackRules()
        .find((rule) => this.satisfiesRule(responses, Object.assign(new FeedbackRule(), rule))) ??
      this.getDefaultRule(this.component.getFeedbackRules())
    );
  }

  protected satisfiesRule(responses: T, rule: FeedbackRule): boolean {
    return FeedbackRule.isSpecialRule(rule)
      ? this.satisfiesSpecialRule(responses, rule)
      : this.satisfiesSpecificRule(responses, rule);
  }

  private satisfiesSpecialRule(responses: T, rule: FeedbackRule): boolean {
    return (
      this.satisfiesNonScorableRule(responses, rule) ||
      this.satisfiesFinalSubmitRule(responses, rule) ||
      this.satisfiesSecondToLastSubmitRule(responses, rule)
    );
  }

  protected satisfiesFinalSubmitRule(responses: T, rule: FeedbackRule): boolean {
    return (
      this.hasMaxSubmitAndIsFinalSubmitRule(rule) &&
      this.component.hasMaxSubmitCountAndUsedAllSubmits(
        (responses[responses.length - 1] as CRaterResponse).submitCounter
      )
    );
  }

  protected hasMaxSubmitAndIsFinalSubmitRule(rule: FeedbackRule): boolean {
    return this.component.hasMaxSubmitCount() && FeedbackRule.isFinalSubmitRule(rule);
  }

  protected satisfiesSecondToLastSubmitRule(responses: T, rule: FeedbackRule): boolean {
    return (
      this.hasMaxSubmitAndIsSecondToLastSubmitRule(rule) &&
      this.isSecondToLastSubmit((responses[responses.length - 1] as CRaterResponse).submitCounter)
    );
  }

  protected hasMaxSubmitAndIsSecondToLastSubmitRule(rule: FeedbackRule): boolean {
    return this.component.hasMaxSubmitCount() && FeedbackRule.isSecondToLastSubmitRule(rule);
  }

  protected isSecondToLastSubmit(submitCounter: number): boolean {
    return this.component.getNumberOfSubmitsLeft(submitCounter) === 1;
  }

  protected satisfiesNonScorableRule(responses: T, rule: FeedbackRule): boolean {
    return (
      rule.expression === 'isNonScorable' &&
      (responses[responses.length - 1] as CRaterResponse).isNonScorable()
    );
  }

  private satisfiesSpecificRule(responses: T, rule: FeedbackRule): boolean {
    const termStack = [];
    for (const term of rule.getPostfixExpression()) {
      if (FeedbackRuleExpression.isOperand(term)) {
        termStack.push(term);
      } else {
        this.evaluateOperator(term, termStack, responses);
      }
    }
    if (termStack.length === 1) {
      return this.evaluateTerm(termStack.pop(), responses);
    }
    return true;
  }

  private evaluateOperator(operator: string, termStack: string[], responses: T) {
    if (this.evaluateOperatorExpression(operator, termStack, responses)) {
      termStack.push('true');
    } else {
      termStack.push('false');
    }
  }

  private evaluateOperatorExpression(operator: string, termStack: string[], responses: T): boolean {
    if (['&&', '||'].includes(operator)) {
      return this.evaluateAndOrExpression(operator, termStack, responses);
    } else {
      return this.evaluateNotExpression(termStack, responses);
    }
  }

  private evaluateAndOrExpression(operator: string, termStack: string[], responses: T): boolean {
    const term1 = termStack.pop();
    const term2 = termStack.pop();
    return operator === '&&'
      ? this.evaluateTerm(term1, responses) && this.evaluateTerm(term2, responses)
      : this.evaluateTerm(term1, responses) || this.evaluateTerm(term2, responses);
  }

  private evaluateNotExpression(termStack: string[], responses: T): boolean {
    return !this.evaluateTerm(termStack.pop(), responses);
  }

  protected evaluateTerm(term: string, responses: T): boolean {
    const evaluator: TermEvaluator = this.factory.getTermEvaluator(term);
    return TermEvaluator.isAccumulatedIdeaCountTerm(term)
      ? evaluator.evaluate(responses)
      : evaluator.evaluate(responses[responses.length - 1]);
  }

  protected getDefaultRule(rules: FeedbackRule[]): FeedbackRule {
    return (
      rules.find((rule) => FeedbackRule.isDefaultRule(rule)) ||
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
