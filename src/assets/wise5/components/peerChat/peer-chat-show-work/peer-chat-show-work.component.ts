import { Component, Input } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { PeerChatMessage } from '../PeerChatMessage';
import { PeerChatService } from '../peerChatService';
import { PeerGroupService } from '../../../services/peerGroupService';

@Component({
  selector: 'peer-chat-show-work',
  templateUrl: 'peer-chat-show-work.component.html'
})
export class PeerChatShowWorkComponent extends ComponentShowWorkDirective {
  isPeerChatWorkgroupsAvailable: boolean = false;
  peerChatMessages: PeerChatMessage[] = [];
  peerChatWorkgroupIds: Set<number>;
  peerChatWorkgroupInfos: any = {};
  requestTimeout: number = 10000;

  @Input()
  workgroupId: any;

  constructor(
    private configService: ConfigService,
    private peerChatService: PeerChatService,
    private peerGroupService: PeerGroupService,
    protected projectService: ProjectService
  ) {
    super(projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.peerChatWorkgroupIds = new Set<number>();
    this.requestChatWorkgroups();
  }

  requestChatWorkgroups(): void {
    this.peerGroupService
      .retrievePeerGroup(this.workgroupId, this.componentContent.peerGroupActivityTag)
      .pipe(timeout(this.requestTimeout))
      .subscribe(
        (peerGroup: any) => {
          this.requestChatWorkgroupsSuccess(peerGroup);
        },
        (error) => {
          // TODO
        }
      );
  }

  requestChatWorkgroupsSuccess(peerGroup: any): void {
    this.addWorkgroupIdsFromPeerGroup(this.peerChatWorkgroupIds, peerGroup);
    this.addTeacherWorkgroupIds(this.peerChatWorkgroupIds);
    this.retrievePeerChatComponentStates(this.nodeId, this.componentId, this.workgroupId);
  }

  addWorkgroupIdsFromPeerGroup(workgroupIds: Set<number>, peerGroup: any): void {
    peerGroup.members.forEach((member: any) => {
      workgroupIds.add(member.id);
    });
  }

  addTeacherWorkgroupIds(workgroupIds: Set<number>): void {
    this.configService.getTeacherWorkgroupIds().forEach((workgroupId) => {
      workgroupIds.add(workgroupId);
    });
  }

  retrievePeerChatComponentStates(nodeId: string, componentId: string, workgroupId: number): void {
    this.peerChatService
      .retrievePeerChatComponentStates(nodeId, componentId, workgroupId)
      .pipe(timeout(this.requestTimeout))
      .subscribe(
        (componentStates: any[]) => {
          this.setPeerChatMessages(componentStates);
          this.addWorkgroupIdsFromPeerChatMessages(this.peerChatWorkgroupIds, componentStates);
          this.setPeerChatWorkgroupInfos(Array.from(this.peerChatWorkgroupIds));
        },
        (error) => {
          // TODO
        }
      );
  }

  setPeerChatMessages(componentStates: any[]): void {
    this.peerChatMessages = [];
    componentStates.forEach((componentState: any) => {
      this.peerChatMessages.push(
        this.peerChatService.convertComponentStateToPeerChatMessage(componentState)
      );
    });
  }

  addWorkgroupIdsFromPeerChatMessages(workgroupIds: Set<number>, componentStates: any[]): void {
    componentStates.forEach((componentState) => {
      workgroupIds.add(componentState.workgroupId);
    });
  }

  setPeerChatWorkgroupInfos(workgroupIds: number[]): void {
    for (const workgroupId of workgroupIds) {
      this.peerChatWorkgroupInfos[workgroupId] = {
        avatarColor: this.configService.getAvatarColorForWorkgroupId(workgroupId),
        displayNames: this.configService.getDisplayUsernamesByWorkgroupId(workgroupId),
        isTeacher: this.configService.isTeacherWorkgroupId(workgroupId)
      };
    }
    this.isPeerChatWorkgroupsAvailable = true;
  }
}
