import { ComponentContent } from '../../common/ComponentContent';
import { ComputerAvatarComponentContent } from '../../common/computer-avatar/computer-avatar-component-content';

export interface AiChatContent extends ComponentContent, ComputerAvatarComponentContent {
  model: 'gpt-3.5-turbo' | 'gpt-4';
  systemPrompt: string;
}
