import { Component, Input } from '@angular/core';
import { now } from 'moment';
import { Subscription } from 'rxjs';
import { ComponentState } from '../../../../../app/domain/componentState';
import { ConfigService } from '../../../services/configService';
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
  @Input()
  workgroupId: any;

  peerGroup: PeerGroup;

  subscriptions: Subscription = new Subscription();

  constructor(
    protected configService: ConfigService,
    protected peerChatService: PeerChatService,
    protected peerGroupService: PeerGroupService,
    protected projectService: ProjectService,
    protected teacherDataService: TeacherDataService,
    protected teacherWebSocketService: TeacherWebSocketService,
    protected teacherWorkService: TeacherWorkService
  ) {
    super(configService, peerChatService, peerGroupService, projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.peerGroupService
      .retrievePeerGroup(this.componentContent.peerGroupActivityTag, this.workgroupId)
      .subscribe((peerGroup) => {
        this.peerGroup = peerGroup;
      });
    this.subscriptions.add(
      this.teacherWebSocketService.newStudentWorkReceived$.subscribe(() => {
        this.ngOnInit();
      })
    );
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.subscriptions.unsubscribe();
  }

  submitTeacherResponse(response: string): void {
    this.teacherWorkService.saveWork(this.createComponentState(response)).subscribe(() => {
      this.ngOnInit();
    });
  }

  createComponentState(response: string): ComponentState {
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
