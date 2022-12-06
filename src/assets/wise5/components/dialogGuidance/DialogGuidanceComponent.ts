import { Component } from '../../common/Component';
import { FeedbackRule } from '../common/feedbackRule/FeedbackRule';
import { DialogGuidanceContent } from './DialogGuidanceContent';

export class DialogGuidanceComponent extends Component {
  content: DialogGuidanceContent;

  getFeedbackRules(): FeedbackRule[] {
    return this.content.feedbackRules;
  }

  getComputerAvatarInitialResponse(): string {
    return this.content.computerAvatarSettings.initialResponse;
  }

  isComputerAvatarEnabled(): boolean {
    return this.content.isComputerAvatarEnabled;
  }

  getItemId(): string {
    return this.content.itemId;
  }

  isComputerAvatarPromptAvailable(): boolean {
    const computerAvatarPrompt = this.content.computerAvatarSettings.prompt;
    return computerAvatarPrompt != null && computerAvatarPrompt !== '';
  }

  isMultipleFeedbackTextsForSameRuleAllowed(): boolean {
    return !this.isVersion1();
  }

  isOnlyOneComputerAvatarAvailable(): boolean {
    return this.content.computerAvatarSettings.ids.length === 1;
  }

  isUseGlobalComputerAvatar(): boolean {
    return this.content.computerAvatarSettings.useGlobalComputerAvatar;
  }

  isVersion1(): boolean {
    return this.content.version == null;
  }

  isVersion2(): boolean {
    return this.content.version === 2;
  }
}
