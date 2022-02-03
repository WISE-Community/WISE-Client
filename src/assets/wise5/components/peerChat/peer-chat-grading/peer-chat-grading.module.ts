import { NgModule } from '@angular/core';
import { PeerChatShowWorkModule } from '../peer-chat-show-work/peer-chat-show-work.module';
import { PeerChatGradingComponent } from './peer-chat-grading.component';

@NgModule({
  declarations: [PeerChatGradingComponent],
  imports: [PeerChatShowWorkModule],
  exports: [PeerChatGradingComponent]
})
export class PeerChatGradingModule {}
