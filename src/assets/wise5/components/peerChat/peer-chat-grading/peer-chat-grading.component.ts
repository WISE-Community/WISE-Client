import { Component, inject } from '@angular/core';
import { ComponentState } from '../../../../../app/domain/componentState';
import { AnnotationService } from '../../../services/annotationService';
import { NotificationService } from '../../../services/notificationService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { TeacherWorkService } from '../../../services/teacherWorkService';
import { PeerChatShowWorkComponent } from '../peer-chat-show-work/peer-chat-show-work.component';
import { PeerChatMessage } from '../PeerChatMessage';
import { PeerGroup } from '../PeerGroup';
import { QuestionBankService } from '../peer-chat-question-bank/questionBank.service';
import { PeerChatChatBoxComponent } from '../peer-chat-chat-box/peer-chat-chat-box.component';
import { PeerChatQuestionBankComponent } from '../peer-chat-question-bank/peer-chat-question-bank.component';

@Component({
  imports: [PeerChatChatBoxComponent, PeerChatQuestionBankComponent],
  providers: [QuestionBankService],
  styleUrl: './peer-chat-grading.component.scss',
  templateUrl: './peer-chat-grading.component.html'
})
export class PeerChatGradingComponent extends PeerChatShowWorkComponent {
  protected annotationService = inject(AnnotationService);
  protected dataService = inject(TeacherDataService);
  protected notificationService = inject(NotificationService);
  protected teacherWebSocketService = inject(TeacherWebSocketService);
  protected teacherWorkService = inject(TeacherWorkService);

  submitTeacherResponse(response: string): void {
    this.sendNotificationsToGroupMembers(this.peerGroup);
    this.teacherWorkService
      .saveWork(this.createComponentState(response))
      .subscribe(() => this.ngOnInit());
  }

  private sendNotificationsToGroupMembers(peerGroup: PeerGroup): void {
    const runId = this.configService.getRunId();
    const periodId = peerGroup.periodId;
    const notificationType = 'PeerChatMessage';
    const teacherWorkgroupId = this.configService.getWorkgroupId();
    const message = 'Your teacher sent a chat message';
    for (const workgroupId of peerGroup.getWorkgroupIds()) {
      const notification = this.notificationService.createNewNotification(
        runId,
        periodId,
        notificationType,
        this.nodeId,
        this.componentId,
        teacherWorkgroupId,
        workgroupId,
        message
      );
      this.notificationService.saveNotificationToServer(notification);
    }
  }

  private createComponentState(response: string): ComponentState {
    return {
      componentId: this.componentId,
      componentType: 'PeerChat',
      isSubmit: true,
      nodeId: this.nodeId,
      runId: this.configService.getRunId(),
      periodId: this.dataService.getCurrentPeriodId(),
      studentData: {
        response: response
      },
      clientSaveTime: new Date().getTime(),
      workgroupId: this.configService.getWorkgroupId(),
      peerGroupId: this.peerGroup.id
    };
  }

  protected deleteClicked(peerChatMessage: PeerChatMessage): void {
    this.saveDeleteAnnotation(peerChatMessage, 'Delete');
  }

  protected undeleteClicked(peerChatMessage: PeerChatMessage): void {
    this.saveDeleteAnnotation(peerChatMessage, 'Undo Delete');
  }

  private saveDeleteAnnotation(peerChatMessage: PeerChatMessage, action: string): void {
    const toWorkgroupId = peerChatMessage.workgroupId;
    const periodId = this.getPeerGroupPeriodId(this.peerGroup);
    const teacherUserInfo = this.configService.getMyUserInfo();
    const fromWorkgroupId = teacherUserInfo.workgroupId;
    const runId = this.configService.getRunId();
    const nodeId = this.nodeId;
    const componentId = this.componentId;
    const studentWorkId = peerChatMessage.componentStateId;
    const data = {
      action: action
    };
    const annotation = this.annotationService.createInappropriateFlagAnnotation(
      runId,
      periodId,
      nodeId,
      componentId,
      fromWorkgroupId,
      toWorkgroupId,
      studentWorkId,
      data
    );
    this.annotationService.saveAnnotation(annotation).then(() => {});
  }

  private getPeerGroupPeriodId(peerGroup: PeerGroup): number {
    for (const member of peerGroup.members) {
      return member.periodId;
    }
    return null;
  }
}
