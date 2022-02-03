import { Component, Input } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { PeerChatMessage } from '../PeerChatMessage';
import { PeerChatService } from '../peerChatService';

@Component({
  selector: 'peer-chat-show-work',
  templateUrl: 'peer-chat-show-work.component.html'
})
export class PeerChatShowWorkComponent extends ComponentShowWorkDirective {
  isPeerChatWorkgroupsAvailable: boolean = false;
  peerChatMessages: PeerChatMessage[] = [];
  peerChatWorkgroupIds: number[] = [];
  peerChatWorkgroupInfos: any = {};
  requestTimeout: number = 10000;

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
