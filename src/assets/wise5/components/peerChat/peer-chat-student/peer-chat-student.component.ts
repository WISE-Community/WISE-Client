import { Component } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { timeout } from 'rxjs/operators';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { ProjectService } from '../../../services/projectService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { StudentWebSocketService } from '../../../services/studentWebSocketService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { PeerChatMessage } from '../PeerChatMessage';
import { PeerChatService } from '../peerChatService';

@Component({
  selector: 'peer-chat-student',
  templateUrl: './peer-chat-student.component.html',
  styleUrls: ['./peer-chat-student.component.scss']
})
export class PeerChatStudentComponent extends ComponentStudent {
  avatarColor: string;
  isPeerChatWorkgroupsResponseReceived: boolean = false;
  isPeerChatWorkgroupsAvailable: boolean = false;
  isShowWorkFromAnotherComponent: boolean = false;
  isSubmitEnabled: boolean = false;
  messageText: string;
  myWorkgroupId: number;
  peerChatMessages: PeerChatMessage[] = [];
  peerChatWorkgroupIds: number[] = [];
  peerChatWorkgroups: any[] = [];
  peerWorkFromAnotherComponent: any = {};
  requestTimeout: number = 10000;
  response: string;
  secondPromptComponentContent: any;
  showWorkComponentId: string;
  showWorkNodeId: string;

  dummyWorkgroupIds = [108, 109];

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    private PeerChatService: PeerChatService,
    private ProjectService: ProjectService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService,
    private StudentWebSocketService: StudentWebSocketService,
    protected upgrade: UpgradeModule,
    protected UtilService: UtilService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      NodeService,
      NotebookService,
      StudentAssetService,
      StudentDataService,
      upgrade,
      UtilService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.myWorkgroupId = this.ConfigService.getWorkgroupId();
    this.showWorkComponentId = this.componentContent.showWorkComponentId;
    this.showWorkNodeId = this.componentContent.showWorkNodeId;
    this.isShowWorkFromAnotherComponent =
      this.ProjectService.getComponentByNodeIdAndComponentId(
        this.showWorkNodeId,
        this.showWorkComponentId
      ) != null;
    this.avatarColor = this.ConfigService.getAvatarColorForWorkgroupId(this.myWorkgroupId);
    if (this.componentContent.secondPrompt != null && this.componentContent.secondPrompt != '') {
      this.secondPromptComponentContent = {
        prompt: this.componentContent.secondPrompt
      };
    }
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
    this.PeerChatService.retrievePeerChatWorkgroups(this.nodeId, this.componentId)
      .pipe(timeout(this.requestTimeout))
      .subscribe(
        (peerGroup: any) => {
          console.log('success');
          this.requestChatWorkgroupsSuccess(this.getPeerGroupWorkgroupIds(peerGroup));
        },
        (err) => {
          console.log('error');
          this.requestChatWorkgroupsError();
        }
      );
  }

  getPeerGroupWorkgroupIds(peerGroup: any): number[] {
    return peerGroup.members.map((member) => member.id);
  }

  requestChatWorkgroupsSuccess(workgroupIds: number[]): void {
    this.isPeerChatWorkgroupsResponseReceived = true;
    this.setPeerChatWorkgroups(workgroupIds);
    if (this.isShowWorkFromAnotherComponent) {
      this.getPeerWorkFromAnotherComponent();
    }
    this.getPeerChatMessages(this.workgroupId);
  }

  requestChatWorkgroupsError(): void {
    // Call the success function for now since we don't have the backend hooked up yet
    this.requestChatWorkgroupsSuccess(this.dummyWorkgroupIds);
  }

  getPeerChatMessages(workgroupId: number): void {
    this.PeerChatService.retrievePeerChatMessages(this.nodeId, this.componentId, workgroupId)
      .pipe(timeout(this.requestTimeout))
      .subscribe(
        () => {
          console.log('success');
          this.getPeerChatMessagesSuccess();
        },
        () => {
          console.log('error');
          this.getPeerChatMessagesError();
        }
      );
  }

  getPeerChatMessagesSuccess(): void {
    // Populate dummy peer chat messages
    this.setPeerChatMessages(
      this.PeerChatService.createDummyComponentStates(this.peerChatWorkgroupIds)
    );
  }

  getPeerChatMessagesError(): void {
    // Call the success function for now since we don't have the backend hooked up yet
    this.getPeerChatMessagesSuccess();
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
    this.peerChatWorkgroups = [];
    for (const workgroupId of workgroupIds) {
      const workgroup = this.getWorkgroup(workgroupId);
      this.peerChatWorkgroups.push(workgroup);
    }
    this.isPeerChatWorkgroupsAvailable = true;
  }

  getWorkgroup(workgroupId: number): any {
    return {
      workgroupId: workgroupId
    };
  }

  getPeerWorkFromAnotherComponent(): void {
    this.PeerChatService.retrievePeerWorkFromComponent(
      this.nodeId,
      this.componentId,
      this.peerChatWorkgroupIds
    )
      .pipe(timeout(this.requestTimeout))
      .subscribe(
        (data: any) => {
          console.log('success');
          this.getPeerWorkFromAnotherComponentSuccess();
        },
        (err) => {
          console.log('error');
          this.getPeerWorkFromAnotherComponentError();
        }
      );
  }

  getPeerWorkFromAnotherComponentSuccess(): void {
    // Populate dummy work from another component for all the workgroups in the group
    const componentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
      this.showWorkNodeId,
      this.showWorkComponentId
    );
    for (const workgroupId of this.peerChatWorkgroupIds) {
      const componentStateCopy = JSON.parse(JSON.stringify(componentState));
      componentStateCopy.workgroupId = workgroupId;
      this.peerWorkFromAnotherComponent[workgroupId] = componentStateCopy;
    }
  }

  getPeerWorkFromAnotherComponentError(): void {
    // Call the success function for now since we don't have the backend hooked up yet
    this.getPeerWorkFromAnotherComponentSuccess();
  }

  submitStudentResponse(): void {
    const peerChatMessage = new PeerChatMessage(
      this.ConfigService.getWorkgroupId(),
      this.messageText,
      new Date().getTime()
    );
    this.addPeerChatMessage(peerChatMessage);
    this.response = this.messageText;
    this.clearStudentMessage();
    this.studentResponseChanged();
    this.emitComponentSubmitTriggered();
  }

  addPeerChatMessage(peerChatMessage: PeerChatMessage): void {
    this.peerChatMessages.push(peerChatMessage);
  }

  clearStudentMessage(): void {
    this.messageText = '';
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

  studentResponseChanged(): void {
    this.isSubmitEnabled = this.messageText.length > 0;
  }

  studentKeyPressed(event: any): void {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (this.isSubmitEnabled) {
        this.submitStudentResponse();
      }
    }
  }
}
