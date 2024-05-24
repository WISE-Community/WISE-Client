import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiChatShowWorkComponent } from './ai-chat-show-work.component';
import { AiChatModule } from '../ai-chat.module';

@NgModule({
  declarations: [AiChatShowWorkComponent],
  imports: [AiChatModule, CommonModule],
  exports: [AiChatShowWorkComponent]
})
export class AiChatShowWorkModule {}
