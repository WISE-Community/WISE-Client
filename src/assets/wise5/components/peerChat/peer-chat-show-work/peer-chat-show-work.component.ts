import { Component, Input } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { PeerChatMessage } from '../PeerChatMessage';
import { PeerChatService } from '../peerChatService';
import { PeerGroupService } from '../../../services/peerGroupService';
import { PeerGroup } from '../PeerGroup';
import { PeerGroupMember } from '../PeerGroupMember';

@Component({
  selector: 'peer-chat-show-work',
  templateUrl: 'peer-chat-show-work.component.html'
})
export class PeerChatShowWorkComponent extends ComponentShowWorkDirective {
  isPeerChatWorkgroupsAvailable: boolean = false;
  peerChatMessages: PeerChatMessage[] = [];
  peerChatWorkgroupIds: Set<number> = new Set<number>();
  peerChatWorkgroupInfos: any = {};
  requestTimeout: number = 10000;

  @Input()
  workgroupId: any;

  constructor(
    protected configService: ConfigService,
    protected peerChatService: PeerChatService,
    protected peerGroupService: PeerGroupService,
    protected projectService: ProjectService
  ) {
    super(projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.requestChatWorkgroups();
  }

  private requestChatWorkgroups(): void {
    this.peerGroupService
      .retrievePeerGroup(this.componentContent.peerGroupActivityTag, this.workgroupId)
      .pipe(timeout(this.requestTimeout))
      .subscribe((peerGroup: any) => {
        this.requestChatWorkgroupsSuccess(peerGroup);
      });
  }

  private requestChatWorkgroupsSuccess(peerGroup: PeerGroup): void {
    this.addWorkgroupIdsFromPeerGroup(this.peerChatWorkgroupIds, peerGroup);
    this.addTeacherWorkgroupIds(this.peerChatWorkgroupIds);
    this.retrievePeerChatComponentStates(this.nodeId, this.componentId, this.workgroupId);
  }

  private addWorkgroupIdsFromPeerGroup(workgroupIds: Set<number>, peerGroup: PeerGroup): void {
    peerGroup.members.forEach((member: PeerGroupMember) => {
      workgroupIds.add(member.id);
    });
  }

  private addTeacherWorkgroupIds(workgroupIds: Set<number>): void {
    this.configService.getTeacherWorkgroupIds().forEach((workgroupId) => {
      workgroupIds.add(workgroupId);
    });
  }

  private retrievePeerChatComponentStates(
    nodeId: string,
    componentId: string,
    workgroupId: number
  ): void {
    this.peerChatService
      .retrievePeerChatComponentStates(nodeId, componentId, workgroupId)
      .pipe(timeout(this.requestTimeout))
      .subscribe((componentStates: any[]) => {
        this.setPeerChatMessages(componentStates);
        this.addWorkgroupIdsFromPeerChatMessages(this.peerChatWorkgroupIds, componentStates);
        this.setPeerChatWorkgroupInfos(Array.from(this.peerChatWorkgroupIds));
      });
  }

  private setPeerChatMessages(componentStates: any[]): void {
    this.peerChatMessages = [];
    componentStates.forEach((componentState: any) => {
      this.peerChatMessages.push(
        this.peerChatService.convertComponentStateToPeerChatMessage(componentState)
      );
    });
  }

  private addWorkgroupIdsFromPeerChatMessages(
    workgroupIds: Set<number>,
    componentStates: any[]
  ): void {
    componentStates.forEach((componentState) => {
      workgroupIds.add(componentState.workgroupId);
    });
  }

  private setPeerChatWorkgroupInfos(workgroupIds: number[]): void {
    for (const workgroupId of workgroupIds) {
      this.peerChatWorkgroupInfos[workgroupId] = {
        avatarColor: this.configService.getAvatarColorForWorkgroupId(workgroupId),
        displayNames: this.configService.isTeacherWorkgroupId(workgroupId)
          ? $localize`Teacher`
          : this.configService.getUsernamesStringByWorkgroupId(workgroupId),
        isTeacher: this.configService.isTeacherWorkgroupId(workgroupId)
      };
    }
    this.isPeerChatWorkgroupsAvailable = true;
  }
}
