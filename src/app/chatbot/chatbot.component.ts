import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { ChatbotService } from './chatbot.service';
import { ConfigService } from '../../assets/wise5/services/configService';
import { DataService } from '../services/data.service';
import { Chat, ChatMessage } from './chat';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { MarkdownComponent } from 'ngx-markdown';
import { ChatHistoryDialogComponent } from './chat-history-dialog.component';
import { ChatService } from '../services/chat/chat.service';
import { OpenAiChatService } from '../services/chat/openAiChat.service';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    MarkdownComponent,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule
  ],
  selector: 'chatbot',
  styleUrl: 'chatbot.component.scss',
  templateUrl: 'chatbot.component.html'
})
export class ChatbotComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private chatbotService: ChatbotService = inject(ChatbotService);
  private chatService: ChatService = inject(OpenAiChatService);
  private configService: ConfigService = inject(ConfigService);
  private dataService: DataService = inject(DataService);
  private projectService = inject(ProjectService);
  private dialog = inject(MatDialog);

  @Input() config: any;
  @Output() closeChatbot = new EventEmitter<void>();
  protected full: boolean = false;
  protected messages: ChatMessage[] = [];
  protected userInput: string = '';
  protected loading: boolean = false;
  protected chats: Chat[] = [];
  protected currentChat: Chat | null = null;
  protected runId: number = this.configService.getRunId();
  protected smallScreen: boolean = false;
  protected workgroupId: number = this.configService.getWorkgroupId();
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.breakpointObserver.observe(['(max-width: 40rem)']).subscribe((result) => {
        this.smallScreen = result.matches;
        this.full = result.matches;
      })
    );

    // Load existing chats or create a new one
    this.chatbotService.getChats(this.runId, this.workgroupId).subscribe({
      next: (chats) => {
        this.chats = chats;
        if (this.chats.length === 0) {
          this.createNewChat();
        } else {
          this.currentChat = this.getLastEditedChat();
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

  private getLastEditedChat(): Chat {
    return this.chats.sort(
      (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    )[0];
  }

  protected fullscreen(): void {
    this.full = !this.full;
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
      const response = await this.chatService.sendMessage(this.messages);
      this.messages.push(
        new ChatMessage('assistant', response, this.dataService.getCurrentNode().id)
      );
      this.currentChat.messages = [...this.messages];
      if (this.messages.filter((m) => m.role === 'user').length === 1) {
        await this.generateAndSetChatTitle(this.messages.find((m) => m.role === 'user'));
      }
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
    await this.chatbotService.createChat(
      this.runId,
      this.workgroupId,
      this.dataService.getCurrentNode().id,
      this.projectService.getProject().chatbot.systemPrompt
    );
    this.chatbotService.getChats(this.runId, this.workgroupId).subscribe((chats) => {
      this.chats = chats;
      this.switchToChat(this.getLastEditedChat());
    });
  }

  /**
   * Generates a title for the current chat based on the first user message
   * and updates the current chat title.
   */
  private async generateAndSetChatTitle(firstUserMessage: ChatMessage): Promise<void> {
    try {
      let newTitle = await this.generateChatTitle(firstUserMessage.content);
      // Remove surrounding quotes if any
      newTitle = newTitle.replace(/^["'](.*)["']$/, '$1').trim();
      if (newTitle) {
        this.currentChat.title = newTitle;
      }
    } catch (error) {
      console.error('Error generating chat title:', error);
    }
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
    return this.chatService.sendMessage(messages);
  }

  protected switchToChat(chat: Chat): void {
    this.currentChat = chat;
    this.messages = [...chat.messages];
    this.scrollToBottom();
  }

  protected openChatHistory(): void {
    const dialogRef = this.dialog.open(ChatHistoryDialogComponent, {
      data: {
        chats: this.chats,
        currentChatId: this.currentChat?.id || null,
        runId: this.runId,
        workgroupId: this.workgroupId
      },
      panelClass: 'dialog-sm'
    });

    dialogRef.afterClosed().subscribe((chat: Chat | undefined) => {
      if (!chat) {
        if (this.chats.length === 0) {
          this.createNewChat();
        } else {
          this.switchToChat(this.getLastEditedChat());
        }
      } else {
        this.switchToChat(chat);
      }
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatContent = document.querySelector('.chatbot__messages');
      if (chatContent) {
        chatContent.scrollTop = chatContent.scrollHeight;
      }
    }, 100);
  }

  protected handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  protected close(): void {
    if (!this.smallScreen) {
      this.full = false;
    }
    this.closeChatbot.emit();
  }
}
