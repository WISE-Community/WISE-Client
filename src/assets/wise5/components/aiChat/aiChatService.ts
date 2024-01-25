import { Injectable } from '@angular/core';
import { ComponentService } from '../componentService';
import { AiChatMessage } from './aiChatMessage';

@Injectable()
export class AiChatService extends ComponentService {
  getComponentTypeLabel() {
    return $localize`AI Chat`;
  }

  createComponent(): any {
    const component: any = super.createComponent();
    component.type = 'AiChat';
    component.model = 'gpt-4';
    component.systemPrompt = '';
    return component;
  }

  async sendChatMessage(messages: AiChatMessage[], model: string): Promise<any> {
    const response = await fetch('/api/chat-gpt', {
      method: 'POST',
      body: JSON.stringify({
        messages: messages,
        model: model
      })
    });
    return response.json();
  }
}
