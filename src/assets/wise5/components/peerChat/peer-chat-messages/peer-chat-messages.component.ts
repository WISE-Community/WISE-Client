import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PeerChatMessage } from '../PeerChatMessage';

@Component({
  selector: 'peer-chat-messages',
  templateUrl: './peer-chat-messages.component.html',
  styleUrls: ['./peer-chat-messages.component.scss']
})
export class PeerChatMessagesComponent implements OnInit {
  @Input()
  isGrading: boolean;

  @Input()
  myWorkgroupId: number;

  @Input()
  peerChatMessages: PeerChatMessage[] = [];

  @Input()
  workgroupInfos: any = {};

  @Output()
  deleteClickedEvent: EventEmitter<PeerChatMessage> = new EventEmitter<PeerChatMessage>();

  @Output()
  undeleteClickedEvent: EventEmitter<PeerChatMessage> = new EventEmitter<PeerChatMessage>();

  constructor() {}

  ngOnInit(): void {}

  protected deleteClicked(peerChatMessage: PeerChatMessage): void {
    this.deleteClickedEvent.emit(peerChatMessage);
  }

  protected undeleteClicked(peerChatMessage: PeerChatMessage): void {
    this.undeleteClickedEvent.emit(peerChatMessage);
  }
}
