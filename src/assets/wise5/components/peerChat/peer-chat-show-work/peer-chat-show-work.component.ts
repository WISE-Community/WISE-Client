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
import { NodeService } from '../../../services/nodeService';
import { FeedbackRule } from '../../common/feedbackRule/FeedbackRule';

@Component({
  selector: 'peer-chat-show-work',
  templateUrl: 'peer-chat-show-work.component.html'
})
export class PeerChatShowWorkComponent extends ComponentShowWorkDirective {
  dynamicPrompt: FeedbackRule;
  isPeerChatWorkgroupsAvailable: boolean = false;
  peerChatMessages: PeerChatMessage[] = [];
  peerChatWorkgroupIds: Set<number> = new Set<number>();
  peerChatWorkgroupInfos: any = {};
  peerGroup: PeerGroup;
  questionBankRule: string[];
  requestTimeout: number = 10000;

  @Input() workgroupId: number;

  constructor(
    protected configService: ConfigService,
    protected nodeService: NodeService,
    protected peerChatService: PeerChatService,
    protected peerGroupService: PeerGroupService,
    protected projectService: ProjectService
  ) {
    super(nodeService, projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.requestChatWorkgroups();
  }

  private requestChatWorkgroups(): void {
    this.peerGroupService
      .retrievePeerGroup(this.componentContent.peerGroupingTag, this.workgroupId)
      .pipe(timeout(this.requestTimeout))
      .subscribe((peerGroup: PeerGroup) => {
        this.requestChatWorkgroupsSuccess(peerGroup);
      });
  }

  private requestChatWorkgroupsSuccess(peerGroup: PeerGroup): void {
    this.peerGroup = peerGroup;
    this.addWorkgroupIdsFromPeerGroup(this.peerChatWorkgroupIds, peerGroup);
    this.addTeacherWorkgroupIds(this.peerChatWorkgroupIds);
    this.retrievePeerChatComponentStates();
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

  private retrievePeerChatComponentStates(): void {
    this.peerChatService
      .retrievePeerChatComponentStates(this.nodeId, this.componentId, this.workgroupId)
      .pipe(timeout(this.requestTimeout))
      .subscribe((componentStates: any[]) => {
        this.setPeerChatMessages(componentStates);
        this.addWorkgroupIdsFromPeerChatMessages(this.peerChatWorkgroupIds, componentStates);
        this.setPeerChatWorkgroupInfos(Array.from(this.peerChatWorkgroupIds));
      });
  }

  private setPeerChatMessages(componentStates: any[]): void {
    this.peerChatMessages = [];
    this.peerChatService.setPeerChatMessages(this.peerChatMessages, componentStates);
    this.dynamicPrompt = this.getDynamicPrompt(componentStates);
    this.questionBankRule = this.getQuestionBankRule(componentStates);
  }

  private getDynamicPrompt(componentStates: any[]): FeedbackRule {
    for (let c = componentStates.length - 1; c >= 0; c--) {
      const dynamicPrompt = componentStates[c].studentData.dynamicPrompt;
      if (dynamicPrompt != null) {
        return dynamicPrompt;
      }
    }
    return null;
  }

  private getQuestionBankRule(componentStates: any[]): string[] {
    for (let c = componentStates.length - 1; c >= 0; c--) {
      const questionBank = componentStates[c].studentData.questionBank;
      if (questionBank != null) {
        return questionBank;
      }
    }
    return null;
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
    this.peerChatService.setPeerChatWorkgroups(this.peerChatWorkgroupInfos, workgroupIds);
    this.isPeerChatWorkgroupsAvailable = true;
  }
}
