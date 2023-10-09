import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'peer-chat-message-input',
  templateUrl: './peer-chat-message-input.component.html'
})
export class PeerChatMessageInputComponent implements OnInit {
  protected isSubmitEnabled: boolean = false;
  @Input() messageText: string = '';
  @Output() responseChangedEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output('onSubmit') submit: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.responseChanged();
  }

  protected responseChanged(): void {
    this.isSubmitEnabled = this.messageText?.length > 0;
    this.responseChangedEvent.emit(this.messageText);
  }

  protected keyPressed(event: any): void {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (this.isSubmitEnabled) {
        this.submitResponse();
      }
    }
  }

  protected submitResponse(): void {
    this.submit.emit(this.messageText);
    this.messageText = '';
    this.isSubmitEnabled = false;
  }

  protected onFocus(event: any): void {
    this.placeCursorAtEndOfMessageText(event);
  }

  private placeCursorAtEndOfMessageText(event: any): void {
    const messageLength = this.messageText.length;
    event.srcElement.selectionStart = messageLength;
    event.srcElement.selectionEnd = messageLength;
  }
}
