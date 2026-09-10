import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PeerChatMessage } from '../PeerChatMessage';
import { PeerChatComponent } from '../PeerChatComponent';
import { PeerGroup } from '../PeerGroup';
import { PeerChatMessagesComponent } from '../peer-chat-messages/peer-chat-messages.component';
import { PeerChatMessageInputComponent } from '../peer-chat-message-input/peer-chat-message-input.component';
import { PeerChatMemberTypingIndicatorComponent } from '../peer-chat-member-typing-indicator/peer-chat-member-typing-indicator.component';

@Component({
  imports: [
    PeerChatMemberTypingIndicatorComponent,
    PeerChatMessageInputComponent,
    PeerChatMessagesComponent
  ],
  selector: 'peer-chat-chat-box',
  styleUrl: './peer-chat-chat-box.component.scss',
  templateUrl: './peer-chat-chat-box.component.html'
})
export class PeerChatChatBoxComponent {
  @Input() component: PeerChatComponent;
  @Output() deleteClickedEvent: EventEmitter<PeerChatMessage> = new EventEmitter<PeerChatMessage>();
  @Input() isEnabled: boolean = true;
  @Input() isGrading: boolean = false;
  @Input() messages: PeerChatMessage[] = [];
  @Input() myWorkgroupId: number;
  @Input() peerGroup: PeerGroup;
  @Input() response: string = '';
  @Output() responseChangedEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output('onSubmit') submit: EventEmitter<string> = new EventEmitter<string>();
  @Output() undeleteClickedEvent: EventEmitter<PeerChatMessage> =
    new EventEmitter<PeerChatMessage>();
  @Input() workgroupInfos: any = {};

  protected deleteClicked(peerChatMessage: PeerChatMessage): void {
    this.deleteClickedEvent.emit(peerChatMessage);
  }

  protected undeleteClicked(peerChatMessage: PeerChatMessage): void {
    this.undeleteClickedEvent.emit(peerChatMessage);
  }

  protected submitResponse(event: string): void {
    this.submit.emit(event);
    this.response = '';
  }

  protected responseChanged(response: string): void {
    this.responseChangedEvent.emit(response);
  }
}
