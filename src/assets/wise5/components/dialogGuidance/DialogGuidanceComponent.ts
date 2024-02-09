import { Component } from '../../common/Component';
import { ComputerAvatarComponent } from '../../common/computer-avatar/computer-avatar-component';
import { applyMixins } from '../../common/apply-mixins';
import { FeedbackRule } from '../common/feedbackRule/FeedbackRule';
import { DialogGuidanceContent } from './DialogGuidanceContent';

export class DialogGuidanceComponent extends Component implements ComputerAvatarComponent {
  content: DialogGuidanceContent;

  getFeedbackRules(): FeedbackRule[] {
    return this.content.feedbackRules;
  }

  getItemId(): string {
    return this.content.itemId;
  }

  isMultipleFeedbackTextsForSameRuleAllowed(): boolean {
    return !this.isVersion1();
  }

  isVersion1(): boolean {
    return this.content.version == null;
  }

  isVersion2(): boolean {
    return this.content.version === 2;
  }

  isComputerAvatarEnabled: () => boolean;
  isComputerAvatarPromptAvailable: () => boolean;
  isOnlyOneComputerAvatarAvailable: () => boolean;
  isUseGlobalComputerAvatar: () => boolean;
  getComputerAvatarInitialResponse: () => string;
}

applyMixins(DialogGuidanceComponent, [ComputerAvatarComponent]);
