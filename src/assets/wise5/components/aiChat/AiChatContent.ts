import { ComponentContent } from '../../common/ComponentContent';
import { ComputerAvatarSettings } from '../dialogGuidance/ComputerAvatarSettings';

export interface AiChatContent extends ComponentContent {
  computerAvatarSettings?: ComputerAvatarSettings;
  isComputerAvatarEnabled?: boolean;
  model: string;
  systemPrompt: string;
}
