import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PeerChatMessage } from '../PeerChatMessage';

@Component({
  selector: 'peer-chat-chat-box',
  templateUrl: './peer-chat-chat-box.component.html',
  styleUrls: ['./peer-chat-chat-box.component.scss']
})
export class PeerChatChatBoxComponent implements OnInit {
  @Input() isEnabled: boolean = true;
  @Input() isGrading: boolean = false;
  @Input() messages: PeerChatMessage[] = [];
  @Input() myWorkgroupId: number;
  @Input() response: string = '';
  @Input() workgroupInfos: any = {};
  workgroupInfosWithoutTeachers: any[];

  @Output() deleteClickedEvent: EventEmitter<PeerChatMessage> = new EventEmitter<PeerChatMessage>();
  @Output() responseChangedEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output('onSubmit') submit: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  undeleteClickedEvent: EventEmitter<PeerChatMessage> = new EventEmitter<PeerChatMessage>();

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
