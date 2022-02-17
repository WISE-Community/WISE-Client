import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'peer-chat-message-input',
  templateUrl: './peer-chat-message-input.component.html'
})
export class PeerChatMessageInputComponent implements OnInit {
  @Output('onSubmit')
  submit: EventEmitter<string> = new EventEmitter<string>();

  isSubmitEnabled: boolean = false;
  messageText: string;

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
    this.isSubmitEnabled = false;
  }
}
