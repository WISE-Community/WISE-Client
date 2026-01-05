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
import { ChatbotService } from './chatbot.service';
import { ConfigService } from '../../assets/wise5/services/configService';
import { DataService } from '../services/data.service';
import { Chat, ChatMessage } from './chat';
import { AwsBedRockService } from './awsBedRock.service';
import { ProjectService } from '../../assets/wise5/services/projectService';

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
  private breakpointObserver = inject(BreakpointObserver);
  private chatbotService: ChatbotService = inject(ChatbotService);
  private awsBedRockService: AwsBedRockService = inject(AwsBedRockService);
  private configService: ConfigService = inject(ConfigService);
  private dataService: DataService = inject(DataService);
  private projectService = inject(ProjectService);

  @Input() config: any;
  protected collapsed: boolean = true;
  protected full: boolean = false;
  protected messages: ChatMessage[] = [];
  protected userInput: string = '';
  protected loading: boolean = false;
  protected chats: Chat[] = [];
  protected currentChat: Chat | null = null;
  protected runId: number = this.configService.getRunId();
  protected workgroupId: number = this.configService.getWorkgroupId();
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
    this.chatbotService.getChats(this.runId, this.workgroupId).subscribe({
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
    this.messages.push(
      new ChatMessage('user', this.userInput, this.dataService.getCurrentNode().id)
    );
    this.userInput = '';
    this.loading = true;
    this.scrollToBottom();
    try {
      const response = await this.awsBedRockService.sendMessage(this.messages);
      this.messages.push(
        new ChatMessage('assistant', response, this.dataService.getCurrentNode().id)
      );
      this.currentChat.messages = [...this.messages];
      await this.chatbotService.updateChat(this.runId, this.workgroupId, this.currentChat);
    } catch (error) {
      this.messages.push(
        new ChatMessage(
          'assistant',
          $localize`Sorry, I encountered an error. Please try again.`,
          this.dataService.getCurrentNode().id
        )
      );
    } finally {
      this.scrollToBottom();
      this.loading = false;
    }
  }

  protected async createNewChat(): Promise<void> {
    const newChat = await this.chatbotService.createChat(
      this.runId,
      this.workgroupId,
      this.dataService.getCurrentNode().id,
      this.projectService.getProject().chatbot.systemPrompt,
      this.getNewChatTitle()
    );
    this.chatbotService
      .getChats(this.runId, this.workgroupId)
      .subscribe((chats) => (this.chats = chats));
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
    await this.chatbotService.deleteChat(this.runId, this.workgroupId, chat.id);
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
      chat.title = newTitle.trim();
      this.chatbotService.updateChat(this.runId, this.workgroupId, chat);
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
