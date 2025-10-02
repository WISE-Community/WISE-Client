import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PeerChatModule } from '../peer-chat.module';
import { PeerChatShowWorkComponent } from './peer-chat-show-work.component';

@NgModule({
  imports: [CommonModule, PeerChatModule, PeerChatShowWorkComponent],
  exports: [PeerChatShowWorkComponent]
})
export class PeerChatShowWorkModule {}
