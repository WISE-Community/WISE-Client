import { ComponentContent } from '../../common/ComponentContent';
import { ComputerAvatarComponentContent } from '../../common/computer-avatar-component-content';
import { FeedbackRule } from '../common/feedbackRule/FeedbackRule';

export interface DialogGuidanceContent extends ComponentContent, ComputerAvatarComponentContent {
  feedbackRules: FeedbackRule[];
  itemId: string;
  version?: number;
}
