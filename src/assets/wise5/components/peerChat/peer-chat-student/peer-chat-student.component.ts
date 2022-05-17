import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { timeout } from 'rxjs/operators';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { NotificationService } from '../../../services/notificationService';
import { PeerGroupService } from '../../../services/peerGroupService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { StudentWebSocketService } from '../../../services/studentWebSocketService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { PeerChatMessage } from '../PeerChatMessage';
import { PeerChatService } from '../peerChatService';
import { PeerGroup } from '../PeerGroup';

@Component({
  selector: 'peer-chat-student',
  templateUrl: './peer-chat-student.component.html',
  styleUrls: ['./peer-chat-student.component.scss']
})
export class PeerChatStudentComponent extends ComponentStudent {
  isPeerChatWorkgroupsResponseReceived: boolean;
  isPeerChatWorkgroupsAvailable: boolean;
  myWorkgroupId: number;
  peerChatMessages: PeerChatMessage[] = [];
  peerChatWorkgroupIds: number[] = [];
  peerChatWorkgroupInfos: any = {};
  peerGroup: PeerGroup;
  peerGroupingTag: string;
  requestTimeout: number = 10000;
  response: string;

  constructor(
    protected annotationService: AnnotationService,
    protected componentService: ComponentService,
    protected configService: ConfigService,
    protected dialog: MatDialog,
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    private notificationService: NotificationService,
    private peerGroupService: PeerGroupService,
    private peerChatService: PeerChatService,
    protected studentAssetService: StudentAssetService,
    protected studentDataService: StudentDataService,
    private studentWebSocketService: StudentWebSocketService,
    protected utilService: UtilService
  ) {
    super(
      annotationService,
      componentService,
      configService,
      dialog,
      nodeService,
      notebookService,
      studentAssetService,
      studentDataService,
      utilService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.myWorkgroupId = this.configService.getWorkgroupId();
    this.peerGroupingTag = this.componentContent.peerGroupingTag;
    this.requestChatWorkgroups();
    this.registerStudentWorkReceivedListener();
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
      .retrievePeerGroup(this.peerGroupingTag, this.workgroupId)
      .pipe(timeout(this.requestTimeout))
      .subscribe(
        (peerGroup: PeerGroup) => {
          this.isPeerChatWorkgroupsResponseReceived = true;
          if (peerGroup != null) {
            this.peerGroup = peerGroup;
            const peerGroupWorkgroupIds = this.getPeerGroupWorkgroupIds(peerGroup);
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

  private getPeerGroupWorkgroupIds(peerGroup: PeerGroup): number[] {
    return peerGroup.members.map((member) => member.id);
  }

  private getPeerChatComponentStates(peerGroup: PeerGroup): void {
    this.peerGroupService
      .retrievePeerGroupWork(peerGroup, this.nodeId, this.componentId)
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
    const peerChatMessage = new PeerChatMessage(
      this.configService.getWorkgroupId(),
      response,
      new Date().getTime()
    );
    this.addPeerChatMessage(peerChatMessage);
    this.response = response;
    this.emitComponentSubmitTriggered();
  }

  private addPeerChatMessage(peerChatMessage: PeerChatMessage): void {
    this.peerChatMessages.push(peerChatMessage);
  }

  createComponentState(action: string): any {
    const componentState: any = this.nodeService.createNewComponentState();
    componentState.studentData = {
      response: this.response,
      submitCounter: this.submitCounter
    };
    componentState.componentType = 'PeerChat';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;
    componentState.isSubmit = true;
    componentState.runId = this.configService.getRunId();
    componentState.periodId = this.configService.getPeriodId();
    componentState.workgroupId = this.configService.getWorkgroupId();
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
    const message = {
      studentWork: componentState,
      type: 'classmateStudentWork'
    };
    for (const workgroupId of this.peerChatWorkgroupIds) {
      if (workgroupId !== this.workgroupId) {
        this.studentWebSocketService.sendMessageToClassmate(workgroupId, message);
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
        this.nodeId,
        this.componentId,
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
}
