import { NgModule } from '@angular/core';
import { PeerChatChatBoxComponent } from './peer-chat-chat-box/peer-chat-chat-box.component';
import { PeerChatMembersComponent } from './peer-chat-members/peer-chat-members.component';
import { PeerChatMemberTypingIndicatorComponent } from './peer-chat-member-typing-indicator/peer-chat-member-typing-indicator.component';
import { PeerChatMessageComponent } from './peer-chat-message/peer-chat-message.component';
import { PeerChatMessageInputComponent } from './peer-chat-message-input/peer-chat-message-input.component';
import { PeerChatMessagesComponent } from './peer-chat-messages/peer-chat-messages.component';
import { PeerChatQuestionBankComponent } from './peer-chat-question-bank/peer-chat-question-bank.component';
import { QuestionBankService } from './peer-chat-question-bank/questionBank.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    PeerChatChatBoxComponent,
    PeerChatMembersComponent,
    PeerChatMemberTypingIndicatorComponent,
    PeerChatMessageInputComponent,
    PeerChatMessagesComponent,
    PeerChatQuestionBankComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    PeerChatMessageComponent
  ],
  exports: [
    PeerChatChatBoxComponent,
    PeerChatMembersComponent,
    PeerChatMessageComponent,
    PeerChatMessageInputComponent,
    PeerChatMessagesComponent,
    PeerChatQuestionBankComponent
  ],
  providers: [QuestionBankService]
})
export class PeerChatModule {}
