import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PeerChatModule } from '../peer-chat.module';
import { PeerChatShowWorkComponent } from './peer-chat-show-work.component';

@NgModule({
  declarations: [PeerChatShowWorkComponent],
  imports: [CommonModule, FlexLayoutModule, PeerChatModule],
  exports: [PeerChatShowWorkComponent]
})
export class PeerChatShowWorkModule {}
