import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PeerChatMessage } from '../PeerChatMessage';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'peer-chat-message',
  styleUrl: './peer-chat-message.component.scss',
  templateUrl: './peer-chat-message.component.html'
})
export class PeerChatMessageComponent implements OnInit {
  @Input() avatarColor: string;
  @Output() deleteClickedEvent: EventEmitter<PeerChatMessage> = new EventEmitter<PeerChatMessage>();
  @Input() displayNames: string;
  @Input() isGrading: boolean;
  protected isMyMessage: boolean;
  @Input() isTeacher: boolean;
  @Input() myWorkgroupId: number;
  @Input() peerChatMessage: PeerChatMessage;
  protected text: string;
  @Output() undeleteClickedEvent: EventEmitter<PeerChatMessage> =
    new EventEmitter<PeerChatMessage>();

  ngOnInit(): void {
    this.text = this.peerChatMessage.text;
    this.isMyMessage = this.myWorkgroupId === this.peerChatMessage.workgroupId;
  }

  protected delete(): void {
    this.peerChatMessage.isDeleted = true;
    this.deleteClickedEvent.emit(this.peerChatMessage);
  }

  protected undelete(): void {
    this.peerChatMessage.isDeleted = false;
    this.undeleteClickedEvent.emit(this.peerChatMessage);
  }
}
