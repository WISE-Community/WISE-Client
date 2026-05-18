import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PeerChatMessage } from '../PeerChatMessage';

import { PeerChatMessageComponent } from '../peer-chat-message/peer-chat-message.component';

@Component({
  imports: [PeerChatMessageComponent],
  selector: 'peer-chat-messages',
  styleUrl: './peer-chat-messages.component.scss',
  templateUrl: './peer-chat-messages.component.html'
})
export class PeerChatMessagesComponent {
  @Output() deleteClickedEvent: EventEmitter<PeerChatMessage> = new EventEmitter<PeerChatMessage>();
  @Input() isGrading: boolean;
  @Input() myWorkgroupId: number;
  @Input() peerChatMessages: PeerChatMessage[] = [];
  @Output() undeleteClickedEvent: EventEmitter<PeerChatMessage> =
    new EventEmitter<PeerChatMessage>();
  @Input() workgroupInfos: any = {};

  protected deleteClicked(peerChatMessage: PeerChatMessage): void {
    this.deleteClickedEvent.emit(peerChatMessage);
  }

  protected undeleteClicked(peerChatMessage: PeerChatMessage): void {
    this.undeleteClickedEvent.emit(peerChatMessage);
  }
}
