import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'chatbot-launcher',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './chatbot-launcher.component.html',
  styleUrl: './chatbot-launcher.component.scss'
})
export class ChatbotLauncherComponent {
  @Output() toggleChatbot = new EventEmitter<void>();

  emitToggleChatbot(): void {
    this.toggleChatbot.emit();
  }
}
