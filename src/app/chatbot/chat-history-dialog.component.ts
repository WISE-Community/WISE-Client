import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Chat } from './chat';
import { ChatbotService } from './chatbot.service';

export interface ChatHistoryDialogData {
  chats: Chat[];
  currentChatId: string | null;
  runId: number;
  workgroupId: number;
}

@Component({
  selector: 'chat-history-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: 'chat-history-dialog.component.html',
  styleUrl: 'chat-history-dialog.component.scss'
})
export class ChatHistoryDialogComponent {
  protected dialogRef = inject(MatDialogRef<ChatHistoryDialogComponent>);
  private chatbotService: ChatbotService = inject(ChatbotService);
  protected data: ChatHistoryDialogData = inject(MAT_DIALOG_DATA);
  protected editingChatId: string | null = null;
  protected editingTitle: string = '';

  protected startEdit(chat: Chat): void {
    this.editingChatId = chat.id;
    this.editingTitle = chat.title;
  }

  protected cancelEdit(): void {
    this.editingChatId = null;
    this.editingTitle = '';
  }

  protected async saveEdit(chat: Chat): Promise<void> {
    if (!this.editingTitle.trim()) {
      return;
    }
    chat.title = this.editingTitle.trim();
    await this.chatbotService.updateChat(this.data.runId, this.data.workgroupId, chat);
    this.cancelEdit();
  }

  protected handleEditKeyPress(event: KeyboardEvent, chat: Chat): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.saveEdit(chat);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelEdit();
    }
  }

  protected async deleteChat(chat: Chat): Promise<void> {
    const msg = $localize`Are you sure you want to delete "${chat.title}"? This action cannot be undone.`;
    if (confirm(msg)) {
      await this.chatbotService.deleteChat(this.data.runId, this.data.workgroupId, chat.id);
      const chatIndex = this.data.chats.findIndex((c) => c.id === chat.id);
      this.data.chats.splice(chatIndex, 1);
      if (this.data.currentChatId === chat.id) {
        if (this.data.chats.length > 0) {
          this.data.currentChatId = this.data.chats[0].id;
        } else {
          this.data.currentChatId = null;
        }
      }
    }
  }

  protected close(): void {
    this.switchToChat(this.data.chats.find((c) => c.id === this.data.currentChatId));
  }

  protected switchToChat(chat: Chat): void {
    if (this.editingChatId) {
      return; // don't switch if we're editing
    }
    this.dialogRef.close(chat);
  }

  protected formatDate(date: Date): string {
    const now = new Date();
    const chatDate = new Date(date);
    const diffMs = now.getTime() - chatDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return $localize`Just now`;
    } else if (diffMins < 60) {
      return $localize`${diffMins}m ago`;
    } else if (diffHours < 24) {
      return $localize`${diffHours}h ago`;
    } else if (diffDays < 7) {
      return $localize`${diffDays}d ago`;
    } else {
      return chatDate.toLocaleDateString();
    }
  }

  protected getMessageCount(chat: Chat): number {
    // Don't count system messages
    return chat.messages.filter((msg) => msg.role !== 'system').length;
  }
}
