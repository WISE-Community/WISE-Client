import { inject, Injectable } from '@angular/core';
import { ChatMessage } from './chat';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AwsBedRockService {
  private chatEndpoint = '/api/aws-bedrock/chat';
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
      model: 'openai.gpt-oss-20b-1:0'
    };
    try {
      const response = await firstValueFrom(this.http.post<any>(`${this.chatEndpoint}`, payload));
      return response.choices[0].message.content.replace(/<reasoning>.*?<\/reasoning>/gs, '');
    } catch (error) {
      console.error('Error calling chat endpoint:', error);
      throw error;
    }
  }
}
