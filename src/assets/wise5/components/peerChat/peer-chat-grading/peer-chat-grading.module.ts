import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PeerChatShowWorkModule } from '../peer-chat-show-work/peer-chat-show-work.module';
import { PeerChatModule } from '../peer-chat.module';
import { PeerChatGradingComponent } from './peer-chat-grading.component';

@NgModule({
  declarations: [PeerChatGradingComponent],
  imports: [CommonModule, FlexLayoutModule, PeerChatModule, PeerChatShowWorkModule],
  exports: [PeerChatGradingComponent]
})
export class PeerChatGradingModule {}
