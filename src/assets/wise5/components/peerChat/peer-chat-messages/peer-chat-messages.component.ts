import { Component, Input, OnInit } from '@angular/core';
import { PeerChatMessage } from '../PeerChatMessage';

@Component({
  selector: 'peer-chat-messages',
  templateUrl: './peer-chat-messages.component.html',
  styleUrls: ['./peer-chat-messages.component.scss']
})
export class PeerChatMessagesComponent implements OnInit {
  @Input()
  peerChatMessages: PeerChatMessage[] = [];

  constructor() {}

  ngOnInit(): void {}
}
