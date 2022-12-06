import { ComputerAvatarSettings } from '../../../../../dist/en-US/assets/wise5/components/dialogGuidance/ComputerAvatarSettings';
import { ComponentContent } from '../../common/ComponentContent';
import { FeedbackRule } from '../common/feedbackRule/FeedbackRule';

export interface DialogGuidanceContent extends ComponentContent {
  computerAvatarSettings?: ComputerAvatarSettings;
  feedbackRules: FeedbackRule[];
  isComputerAvatarEnabled?: boolean;
  itemId: string;
  version?: number;
}
