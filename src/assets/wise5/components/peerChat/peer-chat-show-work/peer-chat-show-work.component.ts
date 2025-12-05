import { Component, Input, inject } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { ConfigService } from '../../../services/configService';
import { PeerChatMessage } from '../PeerChatMessage';
import { PeerChatService } from '../peerChatService';
import { PeerGroupService } from '../../../services/peerGroupService';
import { PeerGroup } from '../PeerGroup';
import { PeerGroupMember } from '../PeerGroupMember';
import { FeedbackRule } from '../../common/feedbackRule/FeedbackRule';
import { QuestionBankRule } from '../peer-chat-question-bank/QuestionBankRule';
import { forkJoin, Observable } from 'rxjs';
import { getQuestionIdsUsed } from '../peer-chat-question-bank/question-bank-helper';

@Component({ template: '' })
export class PeerChatShowWorkComponent extends ComponentShowWorkDirective {
  protected configService = inject(ConfigService);
  dynamicPrompt: FeedbackRule;
  isPeerChatWorkgroupsAvailable: boolean = false;
  peerChatMessages: PeerChatMessage[] = [];
  protected peerChatService = inject(PeerChatService);
  protected peerGroupService = inject(PeerGroupService);
  peerChatWorkgroupIds: Set<number> = new Set<number>();
  peerChatWorkgroupInfos: any = {};
  peerGroup: PeerGroup;
  questionBankRules: QuestionBankRule[];
  questionIdsUsed: string[] = [];
  requestTimeout: number = 10000;
  @Input() workgroupId: number;

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
    forkJoin([
      this.retrievePeerChatComponentStates(),
      this.retrievePeerChatAnnotations()
    ]).subscribe(([componentStates, annotations]) => {
      this.setPeerChatMessages(componentStates);
      this.addWorkgroupIdsFromPeerChatMessages(this.peerChatWorkgroupIds, componentStates);
      this.setPeerChatWorkgroupInfos(Array.from(this.peerChatWorkgroupIds));
      this.peerChatService.processIsDeletedAnnotations(annotations, this.peerChatMessages);
    });
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

  private retrievePeerChatComponentStates(): Observable<any> {
    return this.peerChatService.retrievePeerChatComponentStates(
      this.nodeId,
      this.componentId,
      this.workgroupId
    );
  }

  private retrievePeerChatAnnotations(): Observable<any> {
    return this.peerChatService.retrievePeerChatAnnotations(
      this.nodeId,
      this.componentId,
      this.workgroupId
    );
  }

  private setPeerChatMessages(componentStates: any[]): void {
    this.peerChatMessages = [];
    this.peerChatService.setPeerChatMessages(this.peerChatMessages, componentStates);
    this.dynamicPrompt = this.getDynamicPrompt(componentStates, this.workgroupId);
    this.questionBankRules = this.getQuestionBankRule(componentStates, this.workgroupId);
    this.questionIdsUsed = getQuestionIdsUsed(componentStates, this.workgroupId);
  }

  private getDynamicPrompt(componentStates: any[], workgroupId: number): FeedbackRule {
    return this.getLatestStudentDataFieldForWorkgroup(
      componentStates,
      workgroupId,
      'dynamicPrompt'
    );
  }

  private getQuestionBankRule(componentStates: any[], workgroupId: number): QuestionBankRule[] {
    return this.getLatestStudentDataFieldForWorkgroup(componentStates, workgroupId, 'questionBank');
  }

  private getLatestStudentDataFieldForWorkgroup(
    componentStates: any[],
    workgroupId: number,
    fieldName: string
  ): any {
    for (let c = componentStates.length - 1; c >= 0; c--) {
      const componentState = componentStates[c];
      if (
        componentState.workgroupId === workgroupId &&
        componentState.studentData[fieldName] != null
      ) {
        return componentState.studentData[fieldName];
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
