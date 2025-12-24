import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastUpdated: Date;
}

export interface ChatHistory {
  runId: number;
  workgroupId: number;
  messages: ChatMessage[];
  lastUpdated: Date;
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private apiEndpoint = '/api/chat-gpt';
  private newChatTitlePrefix = $localize`New chat`;
  private http = inject(HttpClient);

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

  getChatHistory(runId: number, workgroupId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatHistory>(`${this.apiEndpoint}/history/${runId}/${workgroupId}`).pipe(
      map((history) => history.messages || []),
      catchError(() => of([]))
    );
  }

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

  getChats(runId: number, workgroupId: number): Chat[] {
    const key = this.getChatStorageKey(runId, workgroupId);
    const stored = localStorage.getItem(key);
    if (!stored) {
      return [];
    }
    try {
      const chats = JSON.parse(stored);
      // Convert date strings back to Date objects
      return chats.map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        lastUpdated: new Date(chat.lastUpdated),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined
        }))
      }));
    } catch (error) {
      console.error('Error parsing chats from localStorage:', error);
      return [];
    }
  }

  createChat(runId: number, workgroupId: number, title?: string): Chat {
    const chats = this.getChats(runId, workgroupId);

    // Generate incremental title if not provided
    let chatTitle = title;
    if (!chatTitle) {
      // Find the highest chat number
      const chatNumbers = chats
        .map((chat) => {
          const match = chat.title.match(new RegExp(`^${this.newChatTitlePrefix} (\\d+)$`));
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter((num) => num > 0);

      const nextNumber = chatNumbers.length > 0 ? Math.max(...chatNumbers) + 1 : 1;
      chatTitle = `${this.newChatTitlePrefix} ${nextNumber}`;
    }

    const newChat: Chat = {
      id: `chat_${Date.now()}`, // Use timestamp as unique ID
      title: chatTitle,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Be polite and concise.'
        }
      ],
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    chats.push(newChat);
    this.saveChats(runId, workgroupId, chats);
    return newChat;
  }

  updateChat(runId: number, workgroupId: number, chat: Chat): void {
    const chats = this.getChats(runId, workgroupId);
    const index = chats.findIndex((c) => c.id === chat.id);
    if (index !== -1) {
      chat.lastUpdated = new Date();
      chats[index] = chat;
      this.saveChats(runId, workgroupId, chats);
    }
  }

  deleteChat(runId: number, workgroupId: number, chatId: string): void {
    const chats = this.getChats(runId, workgroupId);
    const filtered = chats.filter((c) => c.id !== chatId);
    this.saveChats(runId, workgroupId, filtered);
  }

  getChat(runId: number, workgroupId: number, chatId: string): Chat | undefined {
    return this.getChats(runId, workgroupId).find((c) => c.id === chatId);
  }

  private getChatStorageKey(runId: number, workgroupId: number): string {
    return `chatbot_chats_${runId}_${workgroupId}`;
  }

  private saveChats(runId: number, workgroupId: number, chats: Chat[]): void {
    const key = this.getChatStorageKey(runId, workgroupId);
    localStorage.setItem(key, JSON.stringify(chats));
  }
}
