import { ComponentStudent } from '../component-student.component';
import { FeedbackRule } from '../dialogGuidance/FeedbackRule';

export abstract class FeedbackRuleComponent extends ComponentStudent {
  abstract getFeedbackRules(): FeedbackRule[];
  abstract isMultipleFeedbackTextsForSameRuleAllowed(): boolean;
}
