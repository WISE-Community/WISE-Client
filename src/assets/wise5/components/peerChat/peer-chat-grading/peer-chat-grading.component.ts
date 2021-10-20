import { Component, Input } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { ComponentGrading } from '../../../classroomMonitor/classroomMonitorComponents/shared/component-grading.component';
import { ProjectService } from '../../../services/projectService';
import { PeerChatMessage } from '../PeerChatMessage';
import { PeerChatService } from '../peerChatService';

@Component({
  selector: 'peer-chat-grading',
  templateUrl: './peer-chat-grading.component.html',
  styleUrls: ['./peer-chat-grading.component.scss']
})
export class PeerChatGradingComponent extends ComponentGrading {
  peerChatMessages: PeerChatMessage[] = [];
  requestTimeout: number = 10000;

  @Input()
  workgroupId: any;

  constructor(private PeerChatService: PeerChatService, protected ProjectService: ProjectService) {
    super(ProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.retrieveChatMessages(this.workgroupId);
  }

  retrieveChatMessages(workgroupId: number): void {
    this.PeerChatService.retrievePeerChatMessages(this.nodeId, this.componentId, workgroupId)
      .pipe(timeout(this.requestTimeout))
      .subscribe(
        () => {
          console.log('success');
        },
        () => {
          console.log('error');
          this.setPeerChatMessages(
            this.PeerChatService.createDummyComponentStates(this.workgroupId)
          );
        }
      );
  }

  setPeerChatMessages(componentStates: any[]): void {
    this.peerChatMessages = [];
    componentStates.forEach((componentState: any) => {
      this.peerChatMessages.push(
        this.PeerChatService.convertComponentStateToPeerChatMessage(componentState)
      );
    });
  }
}
