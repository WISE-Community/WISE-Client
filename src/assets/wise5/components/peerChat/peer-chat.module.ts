import { NgModule } from '@angular/core';
import { PeerChatChatBoxComponent } from './peer-chat-chat-box/peer-chat-chat-box.component';
import { PeerChatMessageComponent } from './peer-chat-message/peer-chat-message.component';
import { PeerChatMessagesComponent } from './peer-chat-messages/peer-chat-messages.component';
import { PeerChatQuestionBankComponent } from './peer-chat-question-bank/peer-chat-question-bank.component';
import { AngularJSModule } from '../../../../app/common-hybrid-angular.module';

@NgModule({
  declarations: [
    PeerChatChatBoxComponent,
    PeerChatMessageComponent,
    PeerChatMessagesComponent,
    PeerChatQuestionBankComponent
  ],
  imports: [AngularJSModule],
  exports: [
    PeerChatChatBoxComponent,
    PeerChatMessageComponent,
    PeerChatMessagesComponent,
    PeerChatQuestionBankComponent
  ]
})
export class PeerChatModule {}
