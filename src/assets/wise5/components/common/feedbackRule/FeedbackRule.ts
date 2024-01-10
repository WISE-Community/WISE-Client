import { FeedbackRuleExpression } from './FeedbackRuleExpression';

export class FeedbackRule {
  id?: string;
  expression: string;
  feedback?: string | string[];
  prompt?: string;

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      if (jsonObject[key] != null) {
        this[key] = jsonObject[key];
      }
    }
  }

  static isSpecialRule(feedbackRule: FeedbackRule): boolean {
    return ['isDefault', 'isFinalSubmit', 'isSecondToLastSubmit', 'isNonScorable'].includes(
      feedbackRule.expression
    );
  }

  static isSecondToLastSubmitRule(feedbackRule: FeedbackRule): boolean {
    return feedbackRule.expression === 'isSecondToLastSubmit';
  }

  static isFinalSubmitRule(feedbackRule: FeedbackRule): boolean {
    return feedbackRule.expression === 'isFinalSubmit';
  }

  static isDefaultRule(feedbackRule: FeedbackRule): boolean {
    return feedbackRule.expression === 'isDefault';
  }

  getPostfixExpression(): string[] {
    return new FeedbackRuleExpression(this.expression).getPostfix();
  }
}
