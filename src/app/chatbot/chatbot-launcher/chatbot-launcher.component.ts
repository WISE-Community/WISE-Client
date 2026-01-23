import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'chatbot-launcher',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './chatbot-launcher.component.html'
})
export class ChatbotLauncherComponent {
  @Output() toggleChatbot = new EventEmitter<void>();

  protected emitToggleChatbot(): void {
    this.toggleChatbot.emit();
  }
}
