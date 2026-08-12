import { Injectable, inject } from '@angular/core';
import { ComponentService } from '../componentService';
import { AiChatMessage } from './AiChatMessage';
import { AiChatMessageReponse } from './AiChatMessageResponse';
import { ComputerAvatarService } from '../../services/computerAvatarService';


@Injectable()
export class AiChatService extends ComponentService {
  protected type: string = 'AiChat';

  protected computerAvatarService = inject(ComputerAvatarService);

  createComponent(): any {
    const component: any = super.createComponent();
    component.type = this.type;
    component.computerAvatarSettings =
      this.computerAvatarService.getDefaultComputerAvatarSettings();
    component.isComputerAvatarEnabled = false;
    component.model = 'gpt-5.4-mini';
    component.systemPrompt = '';
    return component;
  }

  async sendChatMessage(messages: AiChatMessage[], model: string): Promise<AiChatMessageReponse> {
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
