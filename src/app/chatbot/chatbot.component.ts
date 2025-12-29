import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { ChatbotService, ChatMessage, Chat } from './chatbot.service';
import { ConfigService } from '../../assets/wise5/services/configService';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule
  ],
  selector: 'chatbot',
  styleUrl: 'chatbot.component.scss',
  templateUrl: 'chatbot.component.html'
})
export class ChatbotComponent {
  @Input() config: any;

  private breakpointObserver = inject(BreakpointObserver);
  private chatbotService: ChatbotService = inject(ChatbotService);
  private configService: ConfigService = inject(ConfigService);

  protected collapsed: boolean = true;
  protected full: boolean = false;
  protected messages: ChatMessage[] = [];
  protected userInput: string = '';
  protected loading: boolean = false;
  protected chats: Chat[] = [];
  protected currentChat: Chat | null = null;
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.breakpointObserver.observe(['(max-width: 40rem)']).subscribe((result) => {
        if (!this.collapsed) {
          this.collapsed = true;
          this.fullscreen();
        }
      })
    );

    // Load existing chats or create a new one
    this.chatbotService
      .getChats(this.configService.getRunId(), this.configService.getWorkgroupId())
      .subscribe({
        next: (chats) => {
          this.chats = chats;
          if (this.chats.length === 0) {
            this.createNewChat();
          } else {
            this.currentChat = this.chats[this.chats.length - 1];
            this.messages = [...this.currentChat.messages];
          }
        },
        error: (error) => {
          console.error('Error loading chats:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected toggleCollapse(): void {
    if (this.collapsed && this.breakpointObserver.isMatched('(max-width: 40rem)')) {
      this.fullscreen();
      return;
    }
    if (this.full) {
      this.full = false;
    }
    this.collapsed = !this.collapsed;
    if (!this.collapsed) {
      this.scrollToBottom();
    }
  }

  protected fullscreen(): void {
    if (this.collapsed) {
      this.full = true;
      this.collapsed = false;
    } else {
      this.full = !this.full;
    }
    this.scrollToBottom();
  }

  protected async sendMessage(): Promise<void> {
    if (!this.userInput.trim() || this.loading || !this.currentChat) {
      return;
    }
    const userMessage: ChatMessage = {
      role: 'user',
      content: this.userInput,
      timestamp: new Date()
    };
    this.messages.push(userMessage);
    this.userInput = '';
    this.loading = true;
    this.scrollToBottom();
    try {
      const response = await this.chatbotService.sendMessage(this.messages);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      this.messages.push(assistantMessage);
      this.currentChat.messages = [...this.messages];
      const runId = this.configService.getRunId();
      const workgroupId = this.configService.getWorkgroupId();
      await this.chatbotService.updateChat(runId, workgroupId, this.currentChat);
      this.scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: $localize`Sorry, I encountered an error. Please try again.`,
        timestamp: new Date()
      };
      this.messages.push(errorMessage);
    } finally {
      this.loading = false;
    }
  }

  protected async createNewChat(): Promise<void> {
    const workgroupId = this.configService.getWorkgroupId();
    const runId = this.configService.getRunId();
    const newChat = await this.chatbotService.createChat(
      runId,
      workgroupId,
      this.getNewChatTitle()
    );
    this.chatbotService
      .getChats(this.configService.getRunId(), this.configService.getWorkgroupId())
      .subscribe((chats) => {
        this.chats = chats;
      });
    this.switchToChat(newChat);
  }

  private getNewChatTitle(): string {
    const newChatTitlePrefix = $localize`New chat`;
    // Find the highest chat number in title
    const chatsWithNumInTitle = this.chats
      .map((chat) => {
        const match = chat.title.match(new RegExp(`^${newChatTitlePrefix} (\\d+)$`));
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((num) => num > 0);
    const nextNum = chatsWithNumInTitle.length > 0 ? Math.max(...chatsWithNumInTitle) + 1 : 1;
    return `${newChatTitlePrefix} ${nextNum}`;
  }

  protected switchToChat(chat: Chat): void {
    this.currentChat = chat;
    this.messages = [...chat.messages];
    this.scrollToBottom();
  }

  protected async deleteChat(chat: Chat, event: Event): Promise<void> {
    event.stopPropagation();
    const msg = $localize`Are you sure you want to delete "${chat.title}"? This action cannot be undone.`;
    if (!confirm(msg)) {
      return;
    }
    const workgroupId = this.configService.getWorkgroupId();
    const runId = this.configService.getRunId();
    await this.chatbotService.deleteChat(runId, workgroupId, chat.id);
    const chatIndex = this.chats.findIndex((c) => c.id === chat.id);
    this.chats.splice(chatIndex, 1);
    // If we deleted the current chat, switch to another one or create a new one
    if (this.currentChat?.id === chat.id) {
      if (this.chats.length > 0) {
        this.switchToChat(this.chats[chatIndex] || this.chats[this.chats.length - 1]);
      } else {
        this.createNewChat();
      }
    }
  }

  protected editChatTitle(chat: Chat, event: Event): void {
    event.stopPropagation();
    const newTitle = prompt($localize`Enter new chat title:`, chat.title);
    if (newTitle && newTitle.trim() && newTitle !== chat.title) {
      const workgroupId = this.configService.getWorkgroupId();
      const runId = this.configService.getRunId();
      chat.title = newTitle.trim();
      this.chatbotService.updateChat(runId, workgroupId, chat);
      // Update current chat reference if it's the one being edited
      if (this.currentChat?.id === chat.id) {
        this.currentChat = chat;
      }
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatContent = document.querySelector('.chatbot__messages');
      chatContent.scrollTop = chatContent.scrollHeight;
    }, 100);
  }

  protected handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
