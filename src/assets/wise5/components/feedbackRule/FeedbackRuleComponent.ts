import { FeedbackRule } from '../dialogGuidance/FeedbackRule';

export interface FeedbackRuleComponent {
  getFeedbackRules(): FeedbackRule[];
  getNumberOfSubmitsLeft(): number;
  hasMaxSubmitCount(): boolean;
  hasMaxSubmitCountAndUsedAllSubmits(): boolean;
  isMultipleFeedbackTextsForSameRuleAllowed(): boolean;
}
