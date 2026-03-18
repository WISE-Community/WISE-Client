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

  /**
   * Generates a short, concise title for a chat based on the first message.
   * @param message The first user message content.
   * @returns A promise that resolves to the generated title.
   */
  async generateChatTitle(message: string): Promise<string> {
    const prompt = `Generate a short, concise title (max 5 words) for a chat that starts with this message: "${message}". Respond only with the title, no quotes or extra text. If the language of the message is not English, return the title in that language.`;
    const messages: ChatMessage[] = [
      new ChatMessage(
        'system',
        'You are a helpful assistant that generates short titles for chat conversations.',
        ''
      ),
      new ChatMessage('user', prompt, '')
    ];
    return this.sendMessage(messages);
  }
}
