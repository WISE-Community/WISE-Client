import { Component, Input } from '@angular/core';
import { StompService } from '../../../services/stompService';
import { PeerChatComponent } from '../PeerChatComponent';
import { PeerGroup } from '../PeerGroup';
import { ConfigService } from '../../../services/configService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'peer-chat-member-typing-indicator',
  templateUrl: './peer-chat-member-typing-indicator.component.html'
})
export class PeerChatMemberTypingIndicatorComponent {
  @Input() component: PeerChatComponent;
  private intervalId: NodeJS.Timeout;
  private isTypingDurationBuffer: number = 5000;
  protected message: string;
  @Input() myWorkgroupId: number;
  @Input() peerGroup: PeerGroup;
  private subscriptions: Subscription = new Subscription();
  private workgroupToLastTypingTimestamp: Map<number, number> = new Map<number, number>();

  constructor(private configService: ConfigService, private stompService: StompService) {}

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.updateMessage();
    }, 1000);
    this.subscribeToIsTypingMessages();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.subscriptions.unsubscribe();
  }

  private updateMessage(): void {
    const workgroupsTyping = [];
    this.workgroupToLastTypingTimestamp.forEach((lastTypingTimestamp, workgroupId) => {
      if (new Date().getTime() - lastTypingTimestamp < this.isTypingDurationBuffer) {
        workgroupsTyping.push(workgroupId);
      }
    });
    if (workgroupsTyping.length === 0) {
      this.message = '';
    } else {
      const classmateNames = workgroupsTyping
        .map((workgroupId) =>
          this.configService.getStudentFirstNamesByWorkgroupId(workgroupId).join(', ')
        )
        .join(', ');
      this.message = classmateNames.includes(',')
        ? $localize`${classmateNames} are typing...`
        : $localize`${classmateNames} is typing...`;
    }
  }

  private subscribeToIsTypingMessages(): void {
    this.subscriptions.add(
      this.stompService.rxStomp
        .watch(`/topic/peer-group/${this.peerGroup.id}/is-typing`)
        .subscribe(({ body }) => {
          const { nodeId, componentId, workgroupId } = JSON.parse(JSON.parse(body).content);
          if (
            nodeId === this.component.nodeId &&
            componentId === this.component.id &&
            workgroupId !== this.myWorkgroupId
          ) {
            this.workgroupToLastTypingTimestamp.set(workgroupId, new Date().getTime());
          }
        })
    );
  }
}
