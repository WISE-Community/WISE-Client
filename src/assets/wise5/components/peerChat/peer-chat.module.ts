import { NgModule } from '@angular/core';
import { PeerChatChatBoxComponent } from './peer-chat-chat-box/peer-chat-chat-box.component';
import { PeerChatQuestionBankComponent } from './peer-chat-question-bank/peer-chat-question-bank.component';
import { QuestionBankService } from './peer-chat-question-bank/questionBank.service';

@NgModule({
  imports: [PeerChatChatBoxComponent, PeerChatQuestionBankComponent],
  exports: [PeerChatChatBoxComponent, PeerChatQuestionBankComponent],
  providers: [QuestionBankService]
})
export class PeerChatModule {}
