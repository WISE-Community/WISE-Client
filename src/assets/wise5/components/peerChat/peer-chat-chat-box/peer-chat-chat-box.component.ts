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

  @Output('onSubmit')
  submit: EventEmitter<string> = new EventEmitter<string>();

  isSubmitEnabled: boolean = false;
  messageText: string;

  constructor() {}

  ngOnInit(): void {}

  responseChanged(): void {
    this.isSubmitEnabled = this.messageText.length > 0;
  }

  keyPressed(event: any): void {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (this.isSubmitEnabled) {
        this.submitResponse();
      }
    }
  }

  submitResponse(): void {
    this.submit.emit(this.messageText);
    this.messageText = '';
  }
}
