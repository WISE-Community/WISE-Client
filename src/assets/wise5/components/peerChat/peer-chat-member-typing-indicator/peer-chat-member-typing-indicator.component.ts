import { Component, Input } from '@angular/core';
import { StompService } from '../../../services/stompService';
import { PeerChatComponent } from '../PeerChatComponent';
import { PeerGroup } from '../PeerGroup';
import { ConfigService } from '../../../services/configService';
import { Subscription } from 'rxjs';
import { StudentDataService } from '../../../services/studentDataService';

@Component({
  selector: 'peer-chat-member-typing-indicator',
  templateUrl: './peer-chat-member-typing-indicator.component.html'
})
export class PeerChatMemberTypingIndicatorComponent {
  @Input() component: PeerChatComponent;
  private intervalId: NodeJS.Timeout;
  protected message: string;
  @Input() myWorkgroupId: number;
  @Input() peerGroup: PeerGroup;
  private subscriptions: Subscription = new Subscription();
  private typingDurationBuffer: number = 5000;
  private workgroupToLastTypingTimestamp: Map<number, number> = new Map<number, number>();

  constructor(
    private configService: ConfigService,
    private dataService: StudentDataService,
    private stompService: StompService
  ) {}

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.updateMessage();
    }, 1000);
    this.subscribeToIsTypingMessages();
    this.subscribeToStudentWork();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.subscriptions.unsubscribe();
  }

  private updateMessage(): void {
    const workgroupsTyping = [];
    this.workgroupToLastTypingTimestamp.forEach((lastTypingTimestamp, workgroupId) => {
      if (new Date().getTime() - lastTypingTimestamp < this.typingDurationBuffer) {
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

  private subscribeToStudentWork(): void {
    this.subscriptions.add(
      this.dataService.studentWorkReceived$.subscribe((componentState) => {
        if (this.isMessageFromPeer(componentState)) {
          this.workgroupToLastTypingTimestamp.delete(componentState.workgroupId);
          this.updateMessage();
        }
      })
    );
  }

  private isMessageFromPeer(componentState: any): boolean {
    return (
      this.isForThisComponent(componentState) &&
      this.isFromClassmate(componentState) &&
      componentState.peerGroupId === this.peerGroup.id
    );
  }

  private isForThisComponent(componentState: any): boolean {
    return (
      componentState.nodeId === this.component.nodeId &&
      componentState.componentId === this.component.id
    );
  }

  private isFromClassmate(componentState: any): boolean {
    return componentState.workgroupId !== this.myWorkgroupId;
  }
}
