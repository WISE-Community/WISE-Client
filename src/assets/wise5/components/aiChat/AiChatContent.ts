import { ComponentContent } from '../../common/ComponentContent';

export interface AiChatContent extends ComponentContent {
  model: string;
  systemPrompt: string;
}
