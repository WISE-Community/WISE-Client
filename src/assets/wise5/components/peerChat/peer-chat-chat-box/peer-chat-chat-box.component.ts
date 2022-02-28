import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
    this.workgroupInfosWithoutTeachers = this.getWorkgroupInfosWithoutTeachers(this.workgroupInfos);
  }

  getWorkgroupInfosWithoutTeachers(workgroupInfos: any): any {
    const workgroupInfosWithoutTeachers = {};
    for (const workgroupId of Object.keys(workgroupInfos)) {
      const workgroupInfo = workgroupInfos[workgroupId];
      if (!workgroupInfo.isTeacher) {
        workgroupInfosWithoutTeachers[workgroupId] = workgroupInfo;
      }
    }
    return workgroupInfosWithoutTeachers;
  }
}
