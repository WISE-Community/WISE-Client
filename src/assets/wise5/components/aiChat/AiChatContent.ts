import { ComponentContent } from '../../common/ComponentContent';

export interface AiChatContent extends ComponentContent {
  model: 'gpt-3.5-turbo' | 'gpt-4';
  systemPrompt: string;
}
