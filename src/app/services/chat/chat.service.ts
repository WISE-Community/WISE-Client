import { inject } from '@angular/core';
import { ChatMessage } from '../../chatbot/chat';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export abstract class ChatService {
  protected abstract chatEndpoint: string;
  protected abstract model: string;

  private http = inject(HttpClient);

  /**
   * Sends a message to the chat endpoint.
   * @param messages The conversation history.
   * @returns A promise that resolves to the response from the chat endpoint.
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
