import { inject, Injectable } from '@angular/core';
import { ChatMessage } from '../../chatbot/chat';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChatService {
  protected chatEndpoint = '/api/chat-gpt';
  private http = inject(HttpClient);
  protected model: string = 'gpt-3.5-turbo';

  /**
   * Sends a message to the chat-gpt endpoint.
   * @param messages The conversation history.
   * @returns A promise that resolves to the response from the chat-gpt endpoint.
   */
  async sendMessage(messages: ChatMessage[]): Promise<string> {
    const payload = {
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content
      })),
      model: this.model
    };
    try {
      const response = await firstValueFrom(this.http.post<any>(`${this.chatEndpoint}`, payload));
      return this.processResponse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error calling chat endpoint:', error);
      throw error;
    }
  }

  processResponse(response: string): string {
    return response;
  }
}
