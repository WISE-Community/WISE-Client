import { inject, Injectable } from '@angular/core';
import { ChatMessage } from './chat';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private chatGptEndpoint = '/api/chat-gpt';
  private http = inject(HttpClient);

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
      model: 'gpt-3.5-turbo'
    };
    try {
      const response = await firstValueFrom(
        this.http.post<any>(`${this.chatGptEndpoint}`, payload)
      );
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error calling chat-gpt endpoint:', error);
      throw error;
    }
  }
}
