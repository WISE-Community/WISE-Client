import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';

@Injectable({ providedIn: 'root' })
export class AwsBedRockService extends ChatService {
  protected chatEndpoint = '/api/aws-bedrock/chat';
  protected model: string = 'openai.gpt-oss-20b-1:0';

  processResponse(response: string): string {
    return response.replace(/<reasoning>.*?<\/reasoning>/gs, '');
  }
}
