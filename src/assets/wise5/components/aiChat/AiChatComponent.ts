import { Component } from '../../common/Component';
import { AiChatContent } from './AiChatContent';

export class AiChatComponent extends Component {
  content: AiChatContent;

  isComputerAvatarEnabled(): boolean {
    return this.content.isComputerAvatarEnabled;
  }

  isComputerAvatarPromptAvailable(): boolean {
    const computerAvatarPrompt = this.content.computerAvatarSettings.prompt;
    return computerAvatarPrompt != null && computerAvatarPrompt !== '';
  }

  isOnlyOneComputerAvatarAvailable(): boolean {
    return this.content.computerAvatarSettings.ids.length === 1;
  }

  isUseGlobalComputerAvatar(): boolean {
    return this.content.computerAvatarSettings.useGlobalComputerAvatar;
  }

  getComputerAvatarInitialResponse(): string {
    return this.content.computerAvatarSettings.initialResponse;
  }
}
