import { FeedbackRule } from '../common/feedbackRule/FeedbackRule';

export class FeedbackRuleComponent {
  constructor(
    private feedbackRules: FeedbackRule[],
    private maxSubmitCount: number,
    private multipleFeedbackTextsForSameRuleAllowed: boolean
  ) {}

  getFeedbackRules(): FeedbackRule[] {
    return this.feedbackRules;
  }

  getNumberOfSubmitsLeft(submitCounter: number): number {
    return this.maxSubmitCount - submitCounter;
  }

  hasMaxSubmitCount(): boolean {
    return this.maxSubmitCount != null;
  }

  hasMaxSubmitCountAndUsedAllSubmits(submitCounter: number): boolean {
    return this.hasMaxSubmitCount() && submitCounter >= this.maxSubmitCount;
  }

  isMultipleFeedbackTextsForSameRuleAllowed(): boolean {
    return this.multipleFeedbackTextsForSameRuleAllowed;
  }
}
