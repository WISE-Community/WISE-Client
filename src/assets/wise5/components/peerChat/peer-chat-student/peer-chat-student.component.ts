import { Component } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { timeout } from 'rxjs/operators';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
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
  isPeerChatWorkgroupsResponseReceived: boolean = false;
  isPeerChatWorkgroupsAvailable: boolean = false;
  isSubmitEnabled: boolean = false;
  messageText: string;
  myWorkgroupId: number;
  peerChatMessages: any[] = [];
  peerChatWorkgroupIds: number[] = [];
  peerChatWorkgroups: any[] = [];
  requestTimeout: number = 10000;
  response: string;

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    private PeerChatService: PeerChatService,
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
          const workgroupIds = [1000, 2000];
          this.setPeerChatWorkgroups(workgroupIds);
          this.getPeerChatMessages(workgroupIds);
        }
      );
  }

  setPeerChatWorkgroups(workgroupIds: number[]): void {
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

  getPeerChatMessages(workgroupIds: number[]): void {
    this.PeerChatService.retrievePeerChatMessages(this.nodeId, this.componentId, workgroupIds)
      .pipe(timeout(this.requestTimeout))
      .subscribe(
        () => {
          console.log('success');
        },
        () => {
          console.log('error');
          this.setPeerChatMessages(this.createDummyComponentStates());
        }
      );
  }

  createDummyComponentStates(): any[] {
    return [
      this.createDummyComponentState(1000, 'This is workgroup id 1000 post', 1633731050531),
      this.createDummyComponentState(2000, 'This is workgroup id 2000 post', 1633731060531)
    ];
  }

  createDummyComponentState(workgroupId: number, response: string, timestamp: number): any {
    return {
      studentData: {
        response: response
      },
      serverSaveTime: timestamp,
      workgroupId: workgroupId
    };
  }

  setPeerChatMessages(componentStates: any = []): void {
    this.peerChatMessages = [];
    componentStates.forEach((componentState: any) => {
      this.peerChatMessages.push(this.convertComponentStateToPeerChatMessage(componentState));
    });
  }

  convertComponentStateToPeerChatMessage(componentState: any): PeerChatMessage {
    return new PeerChatMessage(
      componentState.workgroupId,
      componentState.studentData.response,
      componentState.serverSaveTime
    );
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
