import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { timeout } from 'rxjs/operators';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
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
  peerGroupActivityTag: string;
  requestTimeout: number = 10000;
  response: string;

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected dialog: MatDialog,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
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
    this.peerGroupActivityTag = this.componentContent.peerGroupActivityTag;
    this.requestChatWorkgroups();
    this.registerStudentWorkReceivedListener();
  }

  registerStudentWorkReceivedListener(): void {
    this.subscriptions.add(
      this.StudentDataService.studentWorkReceived$.subscribe((componentState) => {
        if (this.isMessageToDisplayForThisChat(componentState)) {
          this.addPeerChatMessage(
            this.PeerChatService.convertComponentStateToPeerChatMessage(componentState)
          );
        }
      })
    );
  }

  isMessageToDisplayForThisChat(componentState: any) {
    return (
      this.isForThisComponent(componentState) &&
      this.isWorkFromClassmate(componentState) &&
      componentState.peerGroupId === this.peerGroup.id
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
    this.peerGroup = peerGroup;
    const peerGroupWorkgroupIds = this.getPeerGroupWorkgroupIds(peerGroup);
    peerGroupWorkgroupIds.push(this.ConfigService.getTeacherWorkgroupId());
    this.setPeerChatWorkgroups(peerGroupWorkgroupIds);
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
      .retrievePeerGroupWork(peerGroup, this.nodeId, this.componentId)
      .pipe(timeout(this.requestTimeout))
      .subscribe((componentStates: any[]) => {
        this.setPeerChatMessages(componentStates);
      });
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
        displayNames: this.ConfigService.isTeacherWorkgroupId(workgroupId)
          ? $localize`Teacher`
          : this.ConfigService.getUsernamesStringByWorkgroupId(workgroupId)
      };
    }
    this.isPeerChatWorkgroupsAvailable = true;
  }

  submitStudentResponse(response: string): void {
    const peerChatMessage = new PeerChatMessage(
      this.ConfigService.getWorkgroupId(),
      response,
      new Date().getTime()
    );
    this.addPeerChatMessage(peerChatMessage);
    this.response = response;
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
    componentState.peerGroupId = this.peerGroup.id;
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

  getAvatarColor(workgroupId: number): string {
    return this.ConfigService.getAvatarColorForWorkgroupId(workgroupId);
  }
}
