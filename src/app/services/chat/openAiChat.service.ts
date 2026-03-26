import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';

@Injectable({ providedIn: 'root' })
export class OpenAiChatService extends ChatService {
  protected chatEndpoint = '/api/chat-gpt';
  protected model: string = 'gpt-4o';
}
