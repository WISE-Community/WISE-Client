import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ChatHistory {
  runId: number;
  workgroupId: number;
  messages: ChatMessage[];
  lastUpdated: Date;
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private http = inject(HttpClient);
  private apiEndpoint = '/api/chat-gpt';

  async sendMessage(
    message: string,
    conversationHistory: ChatMessage[],
    runId: number,
    workgroupId: number
  ): Promise<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const payload = {
      messages: conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content
      })),
      model: 'gpt-3.5-turbo'
    };

    try {
      const response$ = this.http.post<any>(`${this.apiEndpoint}`, payload, { headers });
      const response = await firstValueFrom(response$);

      // this.saveChatHistory(runId, workgroupId, [
      //   ...conversationHistory,
      //   { role: 'user', content: message, timestamp: new Date() },
      //   { role: 'assistant', content: response.response, timestamp: new Date() }
      // ]).subscribe();

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      throw error;
    }
  }

  /**
   * Get chat history for a specific run and workgroup
   */
  getChatHistory(runId: number, workgroupId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatHistory>(`${this.apiEndpoint}/history/${runId}/${workgroupId}`).pipe(
      map((history) => history.messages || []),
      catchError(() => of([]))
    );
  }

  /**
   * Save chat history to the server
   */
  private saveChatHistory(
    runId: number,
    workgroupId: number,
    messages: ChatMessage[]
  ): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${this.apiEndpoint}/history`,
      { runId, workgroupId, messages },
      { headers }
    );
  }
}
