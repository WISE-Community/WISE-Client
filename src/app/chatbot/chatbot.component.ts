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
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { ChatbotService, ChatMessage } from './chatbot.service';
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
    MatTooltipModule
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
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 40rem)']).subscribe((result) => {
      if (!this.collapsed) {
        this.collapsed = true;
        this.fullscreen();
      }
    });

    this.messages.push({
      role: 'system',
      content: 'You are a helpful assistant. Be polite and concise.'
    });
    // Load chat history if available
    //this.loadChatHistory();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadChatHistory(): void {
    const workgroupId = this.configService.getWorkgroupId();
    const runId = this.configService.getRunId();
    this.chatbotService.getChatHistory(runId, workgroupId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error loading chat history:', error);
      }
    });
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
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  protected fullscreen(): void {
    if (this.collapsed) {
      this.full = true;
      this.collapsed = false;
    } else {
      this.full = !this.full;
    }
    setTimeout(() => this.scrollToBottom(), 100);
  }

  protected async sendMessage(): Promise<void> {
    if (!this.userInput.trim() || this.loading) {
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: this.userInput,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const messageToSend = this.userInput;
    this.userInput = '';
    this.loading = true;
    this.scrollToBottom();

    try {
      const workgroupId = this.configService.getWorkgroupId();
      const runId = this.configService.getRunId();

      const response = await this.chatbotService.sendMessage(
        messageToSend,
        this.messages,
        runId,
        workgroupId
      );

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      this.messages.push(assistantMessage);
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
}
