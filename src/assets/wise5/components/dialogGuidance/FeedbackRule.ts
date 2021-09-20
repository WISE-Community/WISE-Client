export class FeedbackRule {
  ideas: string[];
  feedback: string;

  constructor(feedback: string, ideas: string[]) {
    this.feedback = feedback;
    this.ideas = ideas;
  }

  static isSecondToLastSubmitRule(feedbackRule: FeedbackRule): boolean {
    return feedbackRule.ideas[0] === 'isSecondToLastSubmit';
  }

  static isFinalSubmitRule(feedbackRule: FeedbackRule): boolean {
    return feedbackRule.ideas[0] === 'isFinalSubmit';
  }

  static isDefaultRule(feedbackRule: FeedbackRule): boolean {
    return feedbackRule.ideas[0] === 'isDefault';
  }
}
