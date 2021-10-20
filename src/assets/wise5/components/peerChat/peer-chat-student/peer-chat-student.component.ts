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
  }

  requestChatWorkgroups(): void {
    this.PeerChatService.retrievePeerChatWorkgroups(this.nodeId, this.componentId)
      .pipe(timeout(this.requestTimeout))
      .subscribe(
        (data: any) => {
          console.log('success');
        },
        (err) => {
          console.log('error');
          console.log(err);
          this.isPeerChatWorkgroupsResponseReceived = true;
          // const workgroupIds = [1000, 2000, 3000];
          const workgroupIds = [1000, 2000];
          this.setPeerChatWorkgroups(workgroupIds);
          if (this.isShowWorkFromAnotherComponent) {
            this.getPeerWorkFromAnotherComponent();
          }
          this.getPeerChatMessages(this.workgroupId);
        }
      );
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
        },
        (err) => {
          console.log('error');
          console.log(err);
          const componentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
            this.showWorkNodeId,
            this.showWorkComponentId
          );
          const componentState1 = JSON.parse(JSON.stringify(componentState));
          componentState1.workgroupId = 1000;
          const componentState2 = JSON.parse(JSON.stringify(componentState));
          componentState2.workgroupId = 2000;
          // const componentState3 = JSON.parse(JSON.stringify(componentState));
          // componentState3.workgroupId = 3000;
          // this.peerWorkFromAnotherComponent = {
          //   1000: componentState1,
          //   2000: componentState2,
          //   3000: componentState3
          // };
          this.peerWorkFromAnotherComponent = {
            1000: componentState1,
            2000: componentState2
          };
        }
      );
  }

  getPeerChatMessages(workgroupId: number): void {
    this.PeerChatService.retrievePeerChatMessages(this.nodeId, this.componentId, workgroupId)
      .pipe(timeout(this.requestTimeout))
      .subscribe(
        () => {
          console.log('success');
        },
        () => {
          console.log('error');
          this.setPeerChatMessages(this.PeerChatService.createDummyComponentStates());
        }
      );
  }

  setPeerChatMessages(componentStates: any = []): void {
    this.peerChatMessages = [];
    componentStates.forEach((componentState: any) => {
      this.peerChatMessages.push(
        this.PeerChatService.convertComponentStateToPeerChatMessage(componentState)
      );
    });
  }

  submitStudentResponse(): void {
    this.addPeerChatMessage(
      this.ConfigService.getWorkgroupId(),
      this.messageText,
      new Date().getTime()
    );
    this.response = this.messageText;
    this.clearStudentMessage();
    this.studentResponseChanged();
    this.emitComponentSubmitTriggered();
  }

  addPeerChatMessage(workgroupId: number, text: string, timestamp: number): void {
    this.peerChatMessages.push(new PeerChatMessage(workgroupId, text, timestamp));
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
    const promise = new Promise((resolve, reject) => {
      this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
    return promise;
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
