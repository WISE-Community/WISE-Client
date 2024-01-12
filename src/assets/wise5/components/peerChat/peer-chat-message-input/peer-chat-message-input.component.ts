import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StompService } from '../../../services/stompService';
import { ConfigService } from '../../../services/configService';
import { PeerChatComponent } from '../PeerChatComponent';
import { PeerGroup } from '../PeerGroup';

@Component({
  selector: 'peer-chat-message-input',
  templateUrl: './peer-chat-message-input.component.html'
})
export class PeerChatMessageInputComponent implements OnInit {
  @Input() component: PeerChatComponent;
  protected isSubmitEnabled: boolean = false;
  private intervalId: NodeJS.Timeout;
  private isTypingDurationBuffer: number = 5000;
  private lastTypingTimestamp: number = 0;
  @Input() messageText: string = '';
  @Input() peerGroup: PeerGroup;
  @Output() responseChangedEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output('onSubmit') submit: EventEmitter<string> = new EventEmitter<string>();

  constructor(private configService: ConfigService, private stompService: StompService) {}

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.broadcastTypingStatus();
    }, 2500);
  }

  ngOnChanges(): void {
    this.responseChanged();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  protected responseChanged(): void {
    this.isSubmitEnabled = this.messageText?.length > 0;
    this.responseChangedEvent.emit(this.messageText);
  }

  private broadcastTypingStatus(): void {
    if (new Date().getTime() - this.lastTypingTimestamp < this.isTypingDurationBuffer) {
      this.stompService.rxStomp.publish({
        destination: `/app/api/peer-chat/${this.component.nodeId}/${this.component.id}/${
          this.peerGroup.id
        }/${this.configService.getWorkgroupId()}/is-typing`
      });
    }
  }

  protected keyPressed(event: any): void {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (this.isSubmitEnabled) {
        this.submitResponse();
      }
    } else {
      this.lastTypingTimestamp = new Date().getTime();
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
