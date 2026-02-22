import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, MatIconModule],
  selector: 'peer-chat-members',
  styles: ['.mat-icon { vertical-align: middle; } .names { margin: 0 2px; }'],
  templateUrl: './peer-chat-members.component.html'
})
export class PeerChatMembersComponent {
  @Input() peerChatWorkgroupInfos: any[];
}
