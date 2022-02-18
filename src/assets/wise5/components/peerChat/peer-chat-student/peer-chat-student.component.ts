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
  errorRetrievingWorkFromAnotherComponent: boolean;
  isPeerChatWorkgroupsResponseReceived: boolean;
  isPeerChatWorkgroupsAvailable: boolean;
  myWorkgroupId: number;
  peerChatMessages: PeerChatMessage[] = [];
  peerChatWorkgroupIds: number[] = [];
  peerChatWorkgroupInfos: any = {};
  peerGroupId: number;
  peerGroupActivityTag: string;
  peerWorkFromAnotherComponent: any = {};
  requestTimeout: number = 10000;
  response: string;
  showWorkComponentId: string;
  showWorkNodeId: string;

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected dialog: MatDialog,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    private notificationService: NotificationService,
    private peerGroupService: PeerGroupService,
    private PeerChatService: PeerChatService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService,
    private StudentWebSocketService: StudentWebSocketService,
    protected UtilService: UtilService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      dialog,
      NodeService,
      NotebookService,
      StudentAssetService,
      StudentDataService,
      UtilService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.myWorkgroupId = this.ConfigService.getWorkgroupId();
    this.showWorkComponentId = this.componentContent.showWorkComponentId;
    this.showWorkNodeId = this.componentContent.showWorkNodeId;
    this.peerGroupActivityTag = this.componentContent.peerGroupActivityTag;
    this.requestChatWorkgroups();
    this.registerStudentWorkReceivedListener();
  }

  registerStudentWorkReceivedListener(): void {
    this.subscriptions.add(
      this.StudentDataService.studentWorkReceived$.subscribe((componentState) => {
        if (this.isForThisComponent(componentState) && this.isWorkFromClassmate(componentState)) {
          this.addPeerChatMessage(
            this.PeerChatService.convertComponentStateToPeerChatMessage(componentState)
          );
        }
      })
    );
  }

  requestChatWorkgroups(): void {
    this.peerGroupService
      .retrievePeerGroup(this.peerGroupActivityTag)
      .pipe(timeout(this.requestTimeout))
      .subscribe(
        (peerGroup: any) => {
          this.requestChatWorkgroupsSuccess(peerGroup);
        },
        (error) => {
          this.requestChatWorkgroupsError();
        }
      );
  }

  requestChatWorkgroupsSuccess(peerGroup: PeerGroup): void {
    this.isPeerChatWorkgroupsResponseReceived = true;
    this.peerGroupId = peerGroup.id;
    this.setPeerChatWorkgroups(this.getPeerGroupWorkgroupIds(peerGroup));
    this.getPeerChatComponentStates(peerGroup);
  }

  getPeerGroupWorkgroupIds(peerGroup: PeerGroup): number[] {
    return peerGroup.members.map((member) => member.id);
  }

  requestChatWorkgroupsError(): void {
    this.isPeerChatWorkgroupsResponseReceived = true;
  }

  getPeerChatComponentStates(peerGroup: PeerGroup): void {
    this.peerGroupService
      .retrievePeerGroupWork(peerGroup)
      .pipe(timeout(this.requestTimeout))
      .subscribe(
        (componentStates: any[]) => {
          this.getPeerChatComponentStatesSuccess(componentStates);
        },
        (error) => {
          this.getPeerChatComponentStatesError();
        }
      );
  }

  getPeerChatComponentStatesSuccess(componentStates: any[]): void {
    this.setPeerChatMessages(componentStates);
  }

  getPeerChatComponentStatesError(): void {
    // TODO
  }

  setPeerChatMessages(componentStates: any = []): void {
    this.peerChatMessages = [];
    componentStates.forEach((componentState: any) => {
      this.peerChatMessages.push(
        this.PeerChatService.convertComponentStateToPeerChatMessage(componentState)
      );
    });
  }

  setPeerChatWorkgroups(workgroupIds: number[]): void {
    this.peerChatWorkgroupIds = workgroupIds;
    this.peerChatWorkgroupInfos = {};
    for (const workgroupId of workgroupIds) {
      this.peerChatWorkgroupInfos[workgroupId] = {
        avatarColor: this.ConfigService.getAvatarColorForWorkgroupId(workgroupId),
        displayNames: this.ConfigService.getUsernamesStringByWorkgroupId(workgroupId)
      };
    }
    this.isPeerChatWorkgroupsAvailable = true;
  }

  getWorkgroup(workgroupId: number): any {
    return {
      workgroupId: workgroupId
    };
  }

  submitStudentResponse(event): void {
    const peerChatMessage = new PeerChatMessage(
      this.ConfigService.getWorkgroupId(),
      event,
      new Date().getTime()
    );
    this.addPeerChatMessage(peerChatMessage);
    this.response = event;
    this.emitComponentSubmitTriggered();
  }

  addPeerChatMessage(peerChatMessage: PeerChatMessage): void {
    this.peerChatMessages.push(peerChatMessage);
  }

  createComponentState(action: string): any {
    const componentState: any = this.NodeService.createNewComponentState();
    componentState.studentData = {
      response: this.response,
      submitCounter: this.submitCounter
    };
    componentState.componentType = 'PeerChat';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;
    componentState.isSubmit = true;
    componentState.runId = this.ConfigService.getRunId();
    componentState.periodId = this.ConfigService.getPeriodId();
    componentState.workgroupId = this.ConfigService.getWorkgroupId();
    const promise = new Promise((resolve, reject) => {
      this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
    return promise;
  }

  createComponentStateAdditionalProcessing(promise: any, componentState: any, action: string) {
    this.sendWorkToPeerWorkgroups(componentState);
    this.sendNotificationToPeerWorkgroups();
    promise.resolve(componentState);
  }

  sendWorkToPeerWorkgroups(componentState: any): void {
    const message = {
      studentWork: componentState,
      type: 'classmateStudentWork'
    };
    for (const workgroupId of this.peerChatWorkgroupIds) {
      if (workgroupId !== this.workgroupId) {
        this.StudentWebSocketService.sendMessageToClassmate(workgroupId, message);
      }
    }
  }

  sendNotificationToPeerWorkgroups() {
    const runId = this.ConfigService.getRunId();
    const periodId = this.ConfigService.getPeriodId();
    const notificationType = 'PeerChatMessage';
    const firstName = this.ConfigService.getStudentFirstNamesByWorkgroupId(this.workgroupId);
    const message = $localize`${firstName} sent a chat message`;
    for (const peerWorkgroupId of this.peerChatWorkgroupIds) {
      if (peerWorkgroupId !== this.workgroupId) {
        const notification = this.notificationService.createNewNotification(
          runId,
          periodId,
          notificationType,
          this.nodeId,
          this.componentId,
          this.workgroupId,
          peerWorkgroupId,
          message
        );
        this.notificationService.saveNotificationToServer(notification);
      }
    }
  }

  getAvatarColor(workgroupId: number): string {
    return this.ConfigService.getAvatarColorForWorkgroupId(workgroupId);
  }
}
