import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'peer-chat-members',
  templateUrl: './peer-chat-members.component.html',
  styleUrls: ['./peer-chat-members.component.scss']
})
export class PeerChatMembersComponent implements OnInit {
  @Input()
  peerChatWorkgroupInfos: any[];

  constructor() {}

  ngOnInit(): void {}
}
