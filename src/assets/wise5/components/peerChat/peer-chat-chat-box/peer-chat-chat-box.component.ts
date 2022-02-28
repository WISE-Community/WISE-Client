import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { any } from 'angular-ui-router';
import { PeerChatMessage } from '../PeerChatMessage';

@Component({
  selector: 'peer-chat-chat-box',
  templateUrl: './peer-chat-chat-box.component.html',
  styleUrls: ['./peer-chat-chat-box.component.scss']
})
export class PeerChatChatBoxComponent implements OnInit {
  @Input()
  isEnabled: boolean = true;

  @Input()
  messages: PeerChatMessage[] = [];

  @Input()
  myWorkgroupId: number;

  @Input()
  workgroupInfos: any = {};

  workgroupInfosWithoutTeachers: any = {};

  @Output('onSubmit')
  submit: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {
    this.populateWorkgroupInfosWithoutTeachers();
  }

  private populateWorkgroupInfosWithoutTeachers(): void {
    for (const [workgroupId, workgroupInfo] of Object.entries(this.workgroupInfos)) {
      if (!(workgroupInfo as any).isTeacher) {
        this.workgroupInfosWithoutTeachers[workgroupId] = workgroupInfo;
      }
    }
  }
}
