import { Component, Input } from '@angular/core';

@Component({
  selector: 'peer-chat-members',
  templateUrl: './peer-chat-members.component.html',
  styleUrl: './peer-chat-members.component.scss',
  standalone: false
})
export class PeerChatMembersComponent {
  @Input() peerChatWorkgroupInfos: any[];
}
