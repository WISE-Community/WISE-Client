import { FeedbackRuleComponent } from '../../feedbackRule/FeedbackRuleComponent';
import { CRaterResponse } from '../cRater/CRaterResponse';
import { FeedbackRule } from './FeedbackRule';
import { FeedbackRuleExpression } from './FeedbackRuleExpression';
import { TermEvaluator } from './TermEvaluator/TermEvaluator';
import { TermEvaluatorFactory } from './TermEvaluator/TermEvaluatorFactory';

export class FeedbackRuleEvaluator {
  defaultFeedback = $localize`Thanks for submitting your response.`;

  constructor(private component: FeedbackRuleComponent) {}

  getFeedbackRule(response: CRaterResponse | CRaterResponse[]): FeedbackRule {
    for (const feedbackRule of this.component.getFeedbackRules()) {
      if (this.satisfiesRule(response, Object.assign(new FeedbackRule(), feedbackRule))) {
        return feedbackRule;
      }
    }
    return this.getDefaultRule(this.component.getFeedbackRules());
  }

  getFeedbackRules(response: CRaterResponse[]): FeedbackRule[] {
    const matchedRules = this.component
      .getFeedbackRules()
      .filter((rule) => this.satisfiesRule(response, Object.assign(new FeedbackRule(), rule)));
    matchedRules.push(this.getDefaultRule(this.component.getFeedbackRules()));
    return matchedRules;
  }

  private satisfiesRule(
    response: CRaterResponse | CRaterResponse[],
    feedbackRule: FeedbackRule
  ): boolean {
    return this.isSpecialRule(feedbackRule)
      ? this.satisfiesSpecialRule(response, feedbackRule)
      : this.satisfiesSpecificRule(response, feedbackRule);
  }

  private satisfiesSpecialRule(
    response: CRaterResponse | CRaterResponse[],
    feedbackRule: FeedbackRule
  ): boolean {
    return (
      this.satisfiesNonScorableRule(response, feedbackRule) ||
      this.satisfiesFinalSubmitRule(response, feedbackRule) ||
      this.satisfiesSecondToLastSubmitRule(response, feedbackRule)
    );
  }

  private satisfiesFinalSubmitRule(
    response: CRaterResponse | CRaterResponse[],
    feedbackRule: FeedbackRule
  ): boolean {
    return (
      this.hasMaxSubmitAndIsFinalSubmitRule(feedbackRule) &&
      (response instanceof CRaterResponse
        ? this.component.hasMaxSubmitCountAndUsedAllSubmits(response.submitCounter)
        : response.some((response: CRaterResponse) => {
            return this.component.hasMaxSubmitCountAndUsedAllSubmits(response.submitCounter);
          }))
    );
  }

  private hasMaxSubmitAndIsFinalSubmitRule(feedbackRule: FeedbackRule): boolean {
    return this.component.hasMaxSubmitCount() && FeedbackRule.isFinalSubmitRule(feedbackRule);
  }

  private satisfiesSecondToLastSubmitRule(
    response: CRaterResponse | CRaterResponse[],
    feedbackRule: FeedbackRule
  ): boolean {
    return (
      this.hasMaxSubmitAndIsSecondToLastSubmitRule(feedbackRule) &&
      (response instanceof CRaterResponse
        ? this.isSecondToLastSubmit(response.submitCounter)
        : response.some((response: CRaterResponse) => {
            return this.isSecondToLastSubmit(response.submitCounter);
          }))
    );
  }

  private hasMaxSubmitAndIsSecondToLastSubmitRule(feedbackRule: FeedbackRule): boolean {
    return (
      this.component.hasMaxSubmitCount() && FeedbackRule.isSecondToLastSubmitRule(feedbackRule)
    );
  }

  private isSecondToLastSubmit(submitCounter: number): boolean {
    return this.component.getNumberOfSubmitsLeft(submitCounter) === 1;
  }

  private satisfiesNonScorableRule(
    response: CRaterResponse | CRaterResponse[],
    feedbackRule: FeedbackRule
  ): boolean {
    return (
      feedbackRule.expression === 'isNonScorable' &&
      (response instanceof CRaterResponse
        ? response.isNonScorable()
        : response.some((response: CRaterResponse) => {
            return response.isNonScorable();
          }))
    );
  }

  private isSpecialRule(feedbackRule: FeedbackRule): boolean {
    return ['isFinalSubmit', 'isSecondToLastSubmit', 'isNonScorable'].includes(
      feedbackRule.expression
    );
  }

  private satisfiesSpecificRule(
    response: CRaterResponse | CRaterResponse[],
    feedbackRule: FeedbackRule
  ): boolean {
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

  private evaluateOperator(
    operator: string,
    termStack: string[],
    response: CRaterResponse | CRaterResponse[]
  ) {
    if (this.evaluateOperatorExpression(operator, termStack, response)) {
      termStack.push('true');
    } else {
      termStack.push('false');
    }
  }

  private evaluateOperatorExpression(
    operator: string,
    termStack: string[],
    response: CRaterResponse | CRaterResponse[]
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
    response: CRaterResponse | CRaterResponse[]
  ): boolean {
    const term1 = termStack.pop();
    const term2 = termStack.pop();
    return operator === '&&'
      ? this.evaluateTerm(term1, response) && this.evaluateTerm(term2, response)
      : this.evaluateTerm(term1, response) || this.evaluateTerm(term2, response);
  }

  private evaluateNotExpression(
    termStack: string[],
    response: CRaterResponse | CRaterResponse[]
  ): boolean {
    return !this.evaluateTerm(termStack.pop(), response);
  }

  private evaluateTerm(term: string, response: CRaterResponse | CRaterResponse[]): boolean {
    const factory = new TermEvaluatorFactory();
    const evaluator: TermEvaluator = factory.getTermEvaluator(term);
    return response instanceof CRaterResponse
      ? evaluator.evaluate(response)
      : response.some((response: CRaterResponse) => {
          return evaluator.evaluate(response);
        });
  }

  private getDefaultRule(feedbackRules: FeedbackRule[]): FeedbackRule {
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
