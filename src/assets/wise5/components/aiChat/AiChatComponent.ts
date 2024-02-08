import { Component } from '../../common/Component';
import { ComputerAvatarComponent } from '../../common/computer-avatar-component';
import { AiChatContent } from './AiChatContent';
import { applyMixins } from '../../common/apply-mixins';

export class AiChatComponent extends Component implements ComputerAvatarComponent {
  content: AiChatContent;
  isComputerAvatarEnabled: () => boolean;
  isComputerAvatarPromptAvailable: () => boolean;
  isOnlyOneComputerAvatarAvailable: () => boolean;
  isUseGlobalComputerAvatar: () => boolean;
  getComputerAvatarInitialResponse: () => string;
}

applyMixins(AiChatComponent, [ComputerAvatarComponent]);
