import { Component, Input } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { ComponentGrading } from '../../../classroomMonitor/classroomMonitorComponents/shared/component-grading.component';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { PeerChatMessage } from '../PeerChatMessage';
import { PeerChatService } from '../peerChatService';

@Component({
  selector: 'peer-chat-grading',
  templateUrl: './peer-chat-grading.component.html',
  styleUrls: ['./peer-chat-grading.component.scss']
})
export class PeerChatGradingComponent extends ComponentGrading {
  isPeerChatWorkgroupsAvailable: boolean = false;
  peerChatMessages: PeerChatMessage[] = [];
  peerChatWorkgroupIds: number[] = [];
  peerChatWorkgroupInfos: any = {};
  requestTimeout: number = 10000;
  secondPromptComponentContent: any;

  @Input()
  workgroupId: any;

  constructor(
    private configService: ConfigService,
    private peerChatService: PeerChatService,
    protected projectService: ProjectService
  ) {
    super(projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.componentContent.secondPrompt != null && this.componentContent.secondPrompt != '') {
      this.secondPromptComponentContent = {
        prompt: this.componentContent.secondPrompt
      };
    }
    this.retrievePeerChatComponentStates(this.nodeId, this.componentId, this.workgroupId);
  }

  retrievePeerChatComponentStates(nodeId: string, componentId: string, workgroupId: number): void {
    this.peerChatService
      .retrievePeerChatComponentStates(nodeId, componentId, workgroupId)
      .pipe(timeout(this.requestTimeout))
      .subscribe(
        (componentStates: any[]) => {
          this.setPeerChatMessages(componentStates);
          this.setPeerChatWorkgroups(this.peerChatWorkgroupIds);
        },
        (error) => {
          // TODO
        }
      );
  }

  setPeerChatMessages(componentStates: any[]): void {
    this.peerChatMessages = [];
    componentStates.forEach((componentState: any) => {
      this.addToWorkgroupIds(componentState.workgroupId);
      this.peerChatMessages.push(
        this.peerChatService.convertComponentStateToPeerChatMessage(componentState)
      );
    });
  }

  addToWorkgroupIds(workgroupId: number): void {
    if (!this.peerChatWorkgroupIds.includes(workgroupId)) {
      this.peerChatWorkgroupIds.push(workgroupId);
    }
  }

  setPeerChatWorkgroups(workgroupIds: number[]): void {
    for (const workgroupId of workgroupIds) {
      this.peerChatWorkgroupInfos[workgroupId] = {
        avatarColor: this.configService.getAvatarColorForWorkgroupId(workgroupId),
        displayNames: this.configService.getDisplayUsernamesByWorkgroupId(workgroupId)
      };
    }
    this.isPeerChatWorkgroupsAvailable = true;
  }
}
