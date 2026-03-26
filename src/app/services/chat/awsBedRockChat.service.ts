import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';

@Injectable({ providedIn: 'root' })
export class AwsBedRockChatService extends ChatService {
  protected chatEndpoint = '/api/aws-bedrock/chat';
  protected model: string = 'google.gemma-3-27b-it';

  processResponse(response: string): string {
    return response.replace(/<reasoning>.*?<\/reasoning>/gs, '');
  }
}
