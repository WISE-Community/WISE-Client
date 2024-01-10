import { Component } from '@angular/core';
import { ComponentState } from '../../../../../app/domain/componentState';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotificationService } from '../../../services/notificationService';
import { PeerGroupService } from '../../../services/peerGroupService';
import { ProjectService } from '../../../services/projectService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { TeacherWorkService } from '../../../services/teacherWorkService';
import { PeerChatShowWorkComponent } from '../peer-chat-show-work/peer-chat-show-work.component';
import { PeerChatService } from '../peerChatService';
import { PeerGroup } from '../PeerGroup';

@Component({
  selector: 'peer-chat-grading',
  templateUrl: './peer-chat-grading.component.html',
  styleUrls: ['./peer-chat-grading.component.scss']
})
export class PeerChatGradingComponent extends PeerChatShowWorkComponent {
  constructor(
    protected configService: ConfigService,
    protected nodeService: NodeService,
    protected notificationService: NotificationService,
    protected peerChatService: PeerChatService,
    protected peerGroupService: PeerGroupService,
    protected projectService: ProjectService,
    protected teacherDataService: TeacherDataService,
    protected teacherWebSocketService: TeacherWebSocketService,
    protected teacherWorkService: TeacherWorkService
  ) {
    super(configService, nodeService, peerChatService, peerGroupService, projectService);
  }

  submitTeacherResponse(response: string): void {
    this.sendNotificationsToGroupMembers(this.peerGroup);
    this.teacherWorkService.saveWork(this.createComponentState(response)).subscribe(() => {
      this.ngOnInit();
    });
  }

  private sendNotificationsToGroupMembers(peerGroup: PeerGroup): void {
    const runId = this.configService.getRunId();
    const periodId = peerGroup.periodId;
    const notificationType = 'PeerChatMessage';
    const teacherWorkgroupId = this.configService.getWorkgroupId();
    const message = 'Your teacher sent a chat message';
    for (const workgroupId of this.getPeerGroupWorkgroupIds(peerGroup)) {
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

  private getPeerGroupWorkgroupIds(peerGroup: PeerGroup): number[] {
    return peerGroup.members.map((member: any) => member.id);
  }

  private createComponentState(response: string): ComponentState {
    return {
      componentId: this.componentId,
      componentType: 'PeerChat',
      isSubmit: true,
      nodeId: this.nodeId,
      runId: this.configService.getRunId(),
      periodId: this.teacherDataService.getCurrentPeriodId(),
      studentData: {
        response: response
      },
      clientSaveTime: new Date().getTime(),
      workgroupId: this.configService.getWorkgroupId(),
      peerGroupId: this.peerGroup.id
    };
  }
}
