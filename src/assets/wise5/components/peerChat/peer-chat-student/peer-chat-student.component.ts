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
import { PeerGroup } from '../PeerGroup';

@Component({
  selector: 'peer-chat-student',
  templateUrl: './peer-chat-student.component.html',
  styleUrls: ['./peer-chat-student.component.scss']
})
export class PeerChatStudentComponent extends ComponentStudent {
  isPeerChatWorkgroupsResponseReceived: boolean = false;
  isPeerChatWorkgroupsAvailable: boolean = false;
  isShowWorkFromAnotherComponent: boolean = false;
  myWorkgroupId: number;
  peerChatMessages: PeerChatMessage[] = [];
  peerChatWorkgroupIds: number[] = [];
  peerChatWorkgroupInfos: any = {};
  peerGroupId: number;
  peerWorkFromAnotherComponent: any = {};
  requestTimeout: number = 10000;
  response: string;
  secondPromptComponentContent: any;
  showWorkComponentId: string;
  showWorkNodeId: string;

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
          console.log('success getting peer workgroups');
          this.requestChatWorkgroupsSuccess(peerGroup);
        },
        (error) => {
          console.log('error getting peer workgroups');
          this.requestChatWorkgroupsError();
        }
      );
  }

  requestChatWorkgroupsSuccess(peerGroup: PeerGroup): void {
    this.isPeerChatWorkgroupsResponseReceived = true;
    this.peerGroupId = peerGroup.id;
    this.setPeerChatWorkgroups(this.getPeerGroupWorkgroupIds(peerGroup));
    if (this.isShowWorkFromAnotherComponent) {
      this.getPeerWorkFromAnotherComponent();
    }
    this.getPeerChatComponentStates(peerGroup.id);
  }

  getPeerGroupWorkgroupIds(peerGroup: any): number[] {
    return peerGroup.members.map((member) => member.id);
  }

  requestChatWorkgroupsError(): void {
    this.isPeerChatWorkgroupsResponseReceived = true;
  }

  getPeerChatComponentStates(peerGroupId: number): void {
    this.PeerChatService.retrievePeerChatComponentStatesByPeerGroup(peerGroupId)
      .pipe(timeout(this.requestTimeout))
      .subscribe(
        (componentStates: any[]) => {
          console.log('success getting peer chat messages');
          this.getPeerChatComponentStatesSuccess(componentStates);
        },
        (error) => {
          console.log('error getting peer chat messages');
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
        avatarColor: this.getAvatarColor(workgroupId),
        displayNames: this.getDisplayNames(workgroupId)
      };
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
          console.log('success getting peer work from another component');
          this.getPeerWorkFromAnotherComponentSuccess();
        },
        (err) => {
          console.log('error getting peer work from another component');
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
    for (let workgroupId of this.peerChatWorkgroupIds) {
      const componentStateCopy = JSON.parse(JSON.stringify(componentState));
      componentStateCopy.workgroupId = workgroupId;
      this.peerWorkFromAnotherComponent[workgroupId] = componentStateCopy;
    }
  }

  getPeerWorkFromAnotherComponentError(): void {
    // Call the success function for now since we don't have the backend hooked up yet
    this.getPeerWorkFromAnotherComponentSuccess();
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

  getAvatarColor(workgroupId): string {
    return this.ConfigService.getAvatarColorForWorkgroupId(workgroupId);
  }

  getDisplayNames(workgroupId: number): string {
    // TODO: duplciate code in DiscussionService (setUsernames); extract to ConfigService?
    let displayNames: string = '';
    const usernames = this.ConfigService.getUsernamesByWorkgroupId(this.workgroupId);
    if (usernames.length > 0) {
      displayNames = usernames
        .map(function (obj) {
          return obj.name;
        })
        .join(', ');
    }
    return displayNames;
  }
}
