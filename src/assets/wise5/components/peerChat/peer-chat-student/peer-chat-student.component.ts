import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { timeout } from 'rxjs/operators';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { NotificationService } from '../../../services/notificationService';
import { StudentPeerGroupService } from '../../../services/studentPeerGroupService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { StudentWebSocketService } from '../../../services/studentWebSocketService';
import { FeedbackRule } from '../../common/feedbackRule/FeedbackRule';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { QuestionBankContent } from '../peer-chat-question-bank/QuestionBankContent';
import { QuestionBankRule } from '../peer-chat-question-bank/QuestionBankRule';
import { PeerChatComponent } from '../PeerChatComponent';
import { PeerChatMessage } from '../PeerChatMessage';
import { PeerChatService } from '../peerChatService';
import { PeerGroup } from '../PeerGroup';

@Component({
  selector: 'peer-chat-student',
  templateUrl: './peer-chat-student.component.html',
  styleUrls: ['./peer-chat-student.component.scss']
})
export class PeerChatStudentComponent extends ComponentStudent {
  component: PeerChatComponent;
  displayedQuestionBankRules: QuestionBankRule[];
  dynamicPrompt: FeedbackRule;
  isPeerChatWorkgroupsResponseReceived: boolean;
  isPeerChatWorkgroupsAvailable: boolean;
  myWorkgroupId: number;
  peerChatMessages: PeerChatMessage[] = [];
  peerChatWorkgroupIds: number[] = [];
  peerChatWorkgroupInfos: any = {};
  peerGroup: PeerGroup;
  questionBankContent: QuestionBankContent;
  requestTimeout: number = 10000;
  response: string;

  constructor(
    protected annotationService: AnnotationService,
    private changeDetectorRef: ChangeDetectorRef,
    protected componentService: ComponentService,
    protected configService: ConfigService,
    protected dialog: MatDialog,
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    private notificationService: NotificationService,
    private peerGroupService: StudentPeerGroupService,
    private peerChatService: PeerChatService,
    protected studentAssetService: StudentAssetService,
    protected studentDataService: StudentDataService,
    private studentWebSocketService: StudentWebSocketService
  ) {
    super(
      annotationService,
      componentService,
      configService,
      dialog,
      nodeService,
      notebookService,
      studentAssetService,
      studentDataService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.myWorkgroupId = this.configService.isAuthoring() ? 1 : this.configService.getWorkgroupId();
    this.requestChatWorkgroups();
    this.registerStudentWorkReceivedListener();
    this.questionBankContent = this.component.getQuestionBankContent();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  private registerStudentWorkReceivedListener(): void {
    this.subscriptions.add(
      this.studentDataService.studentWorkReceived$.subscribe((componentState) => {
        if (this.isMessageToDisplayForThisChat(componentState)) {
          this.addPeerChatMessage(
            this.peerChatService.convertComponentStateToPeerChatMessage(componentState)
          );
        }
      })
    );
  }

  private isMessageToDisplayForThisChat(componentState: any): boolean {
    return (
      this.isForThisComponent(componentState) &&
      this.isWorkFromClassmate(componentState) &&
      componentState.peerGroupId === this.peerGroup.id
    );
  }

  private requestChatWorkgroups(): void {
    this.peerGroupService
      .retrievePeerGroup(this.component.getPeerGroupingTag(), this.workgroupId)
      .pipe(timeout(this.requestTimeout))
      .subscribe(
        (peerGroup: PeerGroup) => {
          this.isPeerChatWorkgroupsResponseReceived = true;
          if (peerGroup != null) {
            this.peerGroup = peerGroup;
            const peerGroupWorkgroupIds = peerGroup.getWorkgroupIds();
            this.addTeacherWorkgroupIds(peerGroupWorkgroupIds);
            this.setPeerChatWorkgroups(peerGroupWorkgroupIds);
            this.getPeerChatComponentStates(peerGroup);
          }
        },
        (error) => {
          this.isPeerChatWorkgroupsResponseReceived = true;
        }
      );
  }

  private addTeacherWorkgroupIds(workgroupIds: number[]): void {
    workgroupIds.push(...this.configService.getTeacherWorkgroupIds());
  }

  private getPeerChatComponentStates(peerGroup: PeerGroup): void {
    this.peerGroupService
      .retrievePeerGroupWork(peerGroup, this.component.nodeId, this.component.id)
      .pipe(timeout(this.requestTimeout))
      .subscribe((componentStates: any[]) => {
        this.setPeerChatMessages(componentStates);
      });
  }

  private setPeerChatMessages(componentStates: any = []): void {
    this.peerChatMessages = [];
    this.peerChatService.setPeerChatMessages(this.peerChatMessages, componentStates);
  }

  private setPeerChatWorkgroups(workgroupIds: number[]): void {
    this.peerChatWorkgroupIds = workgroupIds;
    this.peerChatWorkgroupInfos = {};
    this.peerChatService.setPeerChatWorkgroups(this.peerChatWorkgroupInfos, workgroupIds);
    this.isPeerChatWorkgroupsAvailable = true;
  }

  submitStudentResponse(response: string): void {
    const peerChatMessage = new PeerChatMessage(this.myWorkgroupId, response, new Date().getTime());
    this.addPeerChatMessage(peerChatMessage);
    this.response = response;
    this.emitComponentSubmitTriggered();
  }

  private addPeerChatMessage(peerChatMessage: PeerChatMessage): void {
    this.peerChatMessages.push(peerChatMessage);
  }

  createComponentState(action: string): any {
    const componentState: any = this.createNewComponentState();
    componentState.studentData = {
      response: this.response,
      submitCounter: this.submitCounter
    };
    if (this.dynamicPrompt != null) {
      componentState.studentData.dynamicPrompt = this.dynamicPrompt;
    }
    if (this.displayedQuestionBankRules != null) {
      componentState.studentData.questionBank = this.displayedQuestionBankRules;
    }
    componentState.componentType = 'PeerChat';
    componentState.nodeId = this.component.nodeId;
    componentState.componentId = this.component.id;
    componentState.isSubmit = true;
    componentState.runId = this.configService.getRunId();
    componentState.periodId = this.configService.getPeriodId();
    componentState.workgroupId = this.myWorkgroupId;
    componentState.peerGroupId = this.peerGroup.id;
    const promise = new Promise((resolve, reject) => {
      return this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
    return promise;
  }

  createComponentStateAdditionalProcessing(promise: any, componentState: any, action: string) {
    this.sendWorkToPeerWorkgroups(componentState);
    this.sendNotificationToPeerWorkgroups(
      this.getWorkgroupIdsToSendNotificationTo(
        this.peerChatWorkgroupIds,
        this.peerChatMessages,
        this.workgroupId
      )
    );
    promise.resolve(componentState);
    return promise;
  }

  private sendWorkToPeerWorkgroups(componentState: any): void {
    for (const workgroupId of this.peerChatWorkgroupIds) {
      if (workgroupId !== this.workgroupId) {
        this.studentWebSocketService.sendStudentWorkToClassmate(workgroupId, componentState);
      }
    }
  }

  private sendNotificationToPeerWorkgroups(workgroupIds: number[]): void {
    const runId = this.configService.getRunId();
    const periodId = this.configService.getPeriodId();
    const notificationType = 'PeerChatMessage';
    const message = $localize`You have new chat messages`;
    for (const workgroupId of workgroupIds) {
      const notification = this.notificationService.createNewNotification(
        runId,
        periodId,
        notificationType,
        this.component.nodeId,
        this.component.id,
        this.workgroupId,
        workgroupId,
        message
      );
      this.notificationService.saveNotificationToServer(notification);
    }
  }

  private getWorkgroupIdsToSendNotificationTo(
    peerChatWorkgroupIds: number[],
    peerChatMessages: PeerChatMessage[],
    myWorkgroupId: number
  ): number[] {
    return peerChatWorkgroupIds.filter((workgroupId) => {
      if (workgroupId === myWorkgroupId) {
        return false;
      } else if (this.isTeacherWorkgroupId(workgroupId)) {
        return this.containsTeacherMessage(peerChatMessages);
      } else {
        return true;
      }
    });
  }

  private containsTeacherMessage(peerChatMessages: PeerChatMessage[]): boolean {
    return peerChatMessages.some((peerChatMessage) =>
      this.isTeacherWorkgroupId(peerChatMessage.workgroupId)
    );
  }

  private isTeacherWorkgroupId(workgroupId: number): boolean {
    return this.configService.getTeacherWorkgroupIds().includes(workgroupId);
  }

  onDynamicPromptChanged(feedbackRule: FeedbackRule): void {
    this.dynamicPrompt = feedbackRule;
  }
}
