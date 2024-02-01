import { ComponentContent } from '../../common/ComponentContent';
import { ComputerAvatarSettings } from '../dialogGuidance/ComputerAvatarSettings';

export interface AiChatContent extends ComponentContent {
  computerAvatarSettings?: ComputerAvatarSettings;
  isComputerAvatarEnabled?: boolean;
  model: 'gpt-3.5-turbo' | 'gpt-4';
  systemPrompt: string;
}
