import { Component, Input, OnInit } from '@angular/core';
import { PeerChatMessage } from '../PeerChatMessage';

@Component({
  selector: 'peer-chat-message',
  templateUrl: './peer-chat-message.component.html',
  styleUrls: ['./peer-chat-message.component.scss']
})
export class PeerChatMessageComponent implements OnInit {
  @Input()
  peerChatMessage: PeerChatMessage;

  text: string;
  timestamp: any;
  workgroupId: number;

  constructor() {}

  ngOnInit(): void {
    this.text = this.peerChatMessage.text;
    this.timestamp = new Date(this.peerChatMessage.timestamp);
    this.workgroupId = this.peerChatMessage.workgroupId;
  }
}
