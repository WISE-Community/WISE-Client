import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../../services/configService';
import { PeerChatMessage } from '../PeerChatMessage';

@Component({
  selector: 'peer-chat-message',
  templateUrl: './peer-chat-message.component.html',
  styleUrls: ['./peer-chat-message.component.scss']
})
export class PeerChatMessageComponent implements OnInit {
  @Input()
  myWorkgroupId: number;

  @Input()
  peerChatMessage: PeerChatMessage;

  avatarColor: string;
  isMyMessage: boolean;
  text: string;
  timestamp: any;
  workgroupId: number;

  constructor(protected ConfigService: ConfigService) {}

  ngOnInit(): void {
    this.text = this.peerChatMessage.text;
    this.timestamp = new Date(this.peerChatMessage.timestamp);
    this.workgroupId = this.peerChatMessage.workgroupId;
    this.isMyMessage = this.myWorkgroupId === this.workgroupId;
    this.avatarColor = this.ConfigService.getAvatarColorForWorkgroupId(this.workgroupId);
  }
}
