import { Component, Input } from '@angular/core';

@Component({
  selector: 'peer-chat-members',
  standalone: false,
  styleUrl: './peer-chat-members.component.scss',
  templateUrl: './peer-chat-members.component.html'
})
export class PeerChatMembersComponent {
  @Input() peerChatWorkgroupInfos: any[];
}
