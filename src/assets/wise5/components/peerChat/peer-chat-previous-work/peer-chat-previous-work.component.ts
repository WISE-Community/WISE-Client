import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'peer-chat-previous-work',
  templateUrl: './peer-chat-previous-work.component.html',
  styleUrls: ['./peer-chat-previous-work.component.scss']
})
export class PeerChatPreviousWorkComponent implements OnInit {
  @Input()
  avatarColor: string;

  @Input()
  displayNames: string;

  @Input()
  errorRetrievingStudentWork: boolean;

  @Input()
  studentWork: any;

  constructor() {}

  ngOnInit(): void {}
}
