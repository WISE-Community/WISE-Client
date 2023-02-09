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
  isGrading: boolean = false;

  @Input()
  messages: PeerChatMessage[] = [];

  @Input()
  myWorkgroupId: number;

  @Input()
  workgroupInfos: any = {};

  workgroupInfosWithoutTeachers: any[];

  @Output()
  deleteClickedEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output('onSubmit')
  submit: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  undeleteClickedEvent: EventEmitter<any> = new EventEmitter<any>();

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
}
