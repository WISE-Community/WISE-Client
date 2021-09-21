export class FeedbackRule {
  feedback: string;
  rule: string[];

  static isSecondToLastSubmitRule(feedbackRule: FeedbackRule): boolean {
    return feedbackRule.rule[0] === 'isSecondToLastSubmit';
  }

  static isFinalSubmitRule(feedbackRule: FeedbackRule): boolean {
    return feedbackRule.rule[0] === 'isFinalSubmit';
  }

  static isDefaultRule(feedbackRule: FeedbackRule): boolean {
    return feedbackRule.rule[0] === 'isDefault';
  }
}
