import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PeerChatMessage } from '../PeerChatMessage';
import { PeerChatComponent } from '../PeerChatComponent';
import { PeerGroup } from '../PeerGroup';
import { MatCardModule } from '@angular/material/card';
import { PeerChatMembersComponent } from '../peer-chat-members/peer-chat-members.component';
import { PeerChatMessagesComponent } from '../peer-chat-messages/peer-chat-messages.component';
import { PeerChatMessageInputComponent } from '../peer-chat-message-input/peer-chat-message-input.component';
import { PeerChatMemberTypingIndicatorComponent } from '../peer-chat-member-typing-indicator/peer-chat-member-typing-indicator.component';
import { CommonModule } from '@angular/common';

@Component({
  imports: [
    CommonModule,
    MatCardModule,
    PeerChatMembersComponent,
    PeerChatMemberTypingIndicatorComponent,
    PeerChatMessageInputComponent,
    PeerChatMessagesComponent
  ],
  selector: 'peer-chat-chat-box',
  styleUrl: './peer-chat-chat-box.component.scss',
  templateUrl: './peer-chat-chat-box.component.html'
})
export class PeerChatChatBoxComponent implements OnInit {
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
  protected workgroupInfosWithoutTeachers: any[];

  ngOnInit(): void {
    this.workgroupInfosWithoutTeachers = this.filterOutTeachers(this.workgroupInfos);
  }

  private filterOutTeachers(workgroupInfos: any): any[] {
    return Object.values(workgroupInfos).filter((workgroupInfo: any) => !workgroupInfo.isTeacher);
  }

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
