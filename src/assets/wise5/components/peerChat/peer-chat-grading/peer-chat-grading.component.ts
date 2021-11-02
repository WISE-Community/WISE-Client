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
  peerGroupId: number;
  requestTimeout: number = 10000;

  @Input()
  workgroupId: any;

  constructor(private PeerChatService: PeerChatService, protected ProjectService: ProjectService) {
    super(ProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.retrievePeerChatComponentStates(this.nodeId, this.componentId, this.workgroupId);
  }

  retrievePeerChatComponentStates(nodeId: string, componentId: string, workgroupId: number): void {
    this.PeerChatService.retrievePeerChatComponentStates(nodeId, componentId, workgroupId)
      .pipe(timeout(this.requestTimeout))
      .subscribe(
        (componentStates: any[]) => {
          console.log('success');
          this.setPeerChatMessages(componentStates);
        },
        () => {
          console.log('error');
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
