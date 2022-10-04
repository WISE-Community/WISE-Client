import { FeedbackRule } from '../common/feedbackRule/FeedbackRule';

export class FeedbackRuleComponent {
  constructor(
    private feedbackRules: FeedbackRule[],
    private maxSubmitCount: number,
    private multipleFeedbackTextsForSameRuleAllowed: boolean,
    private submitCount: number
  ) {}

  getFeedbackRules(): FeedbackRule[] {
    return this.feedbackRules;
  }

  getNumberOfSubmitsLeft(): number {
    return this.maxSubmitCount - this.submitCount;
  }

  hasMaxSubmitCount(): boolean {
    return this.maxSubmitCount != null;
  }

  hasMaxSubmitCountAndUsedAllSubmits(): boolean {
    return this.hasMaxSubmitCount() && this.getNumberOfSubmitsLeft() <= 0;
  }

  isMultipleFeedbackTextsForSameRuleAllowed(): boolean {
    return this.multipleFeedbackTextsForSameRuleAllowed;
  }
}
