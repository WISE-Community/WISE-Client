import { FeedbackRule } from '../common/feedbackRule/FeedbackRule';

export interface FeedbackRuleComponent {
  getFeedbackRules(): FeedbackRule[];
  getNumberOfSubmitsLeft(): number;
  hasMaxSubmitCount(): boolean;
  hasMaxSubmitCountAndUsedAllSubmits(): boolean;
  isMultipleFeedbackTextsForSameRuleAllowed(): boolean;
}
