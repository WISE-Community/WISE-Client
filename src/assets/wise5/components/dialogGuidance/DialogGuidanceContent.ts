import { ComponentContent } from '../../common/ComponentContent';
import { FeedbackRule } from '../common/feedbackRule/FeedbackRule';
import { ComputerAvatarSettings } from './ComputerAvatarSettings';

export interface DialogGuidanceContent extends ComponentContent {
  computerAvatarSettings?: ComputerAvatarSettings;
  feedbackRules: FeedbackRule[];
  isComputerAvatarEnabled?: boolean;
  itemId: string;
  version?: number;
}
