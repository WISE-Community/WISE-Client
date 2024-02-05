import { Component } from '../../common/Component';
import { ComputerAvatarComponent } from '../../common/computer-avatar-component';
import { AiChatContent } from './AiChatContent';
import { applyMixins } from '../../common/apply-mixins';

export interface AiChatComponent {
  isComputerAvatarEnabled(): boolean;
  isComputerAvatarPromptAvailable(): boolean;
  isOnlyOneComputerAvatarAvailable(): boolean;
  isUseGlobalComputerAvatar(): boolean;
  getComputerAvatarInitialResponse(): string;
}

export class AiChatComponent extends Component implements ComputerAvatarComponent {
  content: AiChatContent;
}

applyMixins(AiChatComponent, [ComputerAvatarComponent]);
