'use strict';

import { Injectable } from '@angular/core';
import { AnnotationService } from './annotationService';
import { ConfigService } from './configService';
import { TagService } from './tagService';
import { StudentDataService } from './studentDataService';
import { NodeService } from './nodeService';
import { NotificationService } from './notificationService';
import { ProjectService } from './projectService';
import { Notification } from '../../../app/domain/notification';
import { Message } from '@stomp/stompjs';
import { RxStomp } from '@stomp/rx-stomp';
import { NotebookService } from './notebookService';
import { PauseScreenService } from './pauseScreenService';

@Injectable()
export class StudentWebSocketService {
  rxStomp: RxStomp;

  constructor(
    private AnnotationService: AnnotationService,
    private ConfigService: ConfigService,
    private NodeService: NodeService,
    private notebookService: NotebookService,
    private NotificationService: NotificationService,
    private pauseScreenService: PauseScreenService,
    private ProjectService: ProjectService,
    private StudentDataService: StudentDataService,
    private TagService: TagService
  ) {}

  initialize(): void {
    this.initializeStomp();
    this.subscribeToClassroomTopic();
    this.subscribeToWorkgroupTopic();
  }

  initializeStomp(): void {
    this.rxStomp = new RxStomp();
    this.rxStomp.configure({
      brokerURL: this.ConfigService.getWebSocketURL()
    });
    this.rxStomp.activate();
  }

  subscribeToClassroomTopic(): void {
    this.rxStomp
      .watch(
        `/topic/classroom/${this.ConfigService.getRunId()}/${this.ConfigService.getPeriodId()}`
      )
      .subscribe((message: Message) => {
        const body = JSON.parse(message.body);
        if (body.type === 'pause') {
          this.pauseScreenService.pauseScreen();
        } else if (body.type === 'unpause') {
          this.pauseScreenService.unPauseScreen();
        } else if (body.type === 'studentWork') {
          const studentWork = JSON.parse(body.content);
          this.StudentDataService.broadcastStudentWorkReceived(studentWork);
        } else if (body.type === 'annotation') {
          const annotation = JSON.parse(body.content);
          this.AnnotationService.broadcastAnnotationReceived({ annotation: annotation });
        } else if (body.type === 'goToNode') {
          this.goToStep(body.content);
        } else if (body.type === 'node') {
          this.updateNode(body.content);
        }
      });
  }

  subscribeToWorkgroupTopic(): void {
    this.rxStomp
      .watch(`/topic/workgroup/${this.ConfigService.getWorkgroupId()}`)
      .subscribe((message: Message) => {
        const body = JSON.parse(message.body);
        if (body.type === 'notification') {
          const notification = JSON.parse(body.content);
          this.NotificationService.addNotification(notification);
          if (this.isDismissImmediately(notification)) {
            this.NotificationService.dismissNotification(notification);
          }
        } else if (body.type === 'annotation') {
          const annotationData = JSON.parse(body.content);
          this.AnnotationService.addOrUpdateAnnotation(annotationData);
          this.handleAnnotationReceived(annotationData);
        } else if (body.type === 'tagsToWorkgroup') {
          const tags = JSON.parse(body.content);
          this.TagService.setTags(tags);
          this.StudentDataService.updateNodeStatuses();
          this.NodeService.evaluateTransitionLogic();
        } else if (body.type === 'goToNode') {
          this.goToStep(body.content);
        } else if (body.type === 'goToNextNode') {
          this.goToNextStep();
        } else if (body.type === 'classmateStudentWork') {
          this.StudentDataService.broadcastStudentWorkReceived(JSON.parse(body.content));
        }
      });
  }

  handleAnnotationReceived(annotation: any): void {
    this.StudentDataService.studentData.annotations.push(annotation);
    if (annotation.notebookItemId) {
      this.notebookService.broadcastNotebookItemAnnotationReceived({ annotation: annotation });
    } else {
      this.AnnotationService.broadcastAnnotationReceived({ annotation: annotation });
    }
  }

  isDismissImmediately(notification: Notification): boolean {
    return (
      notification.nodeId === this.StudentDataService.getCurrentNodeId() &&
      notification.type === 'PeerChatMessage'
    );
  }

  goToStep(nodeId: string): void {
    this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(nodeId);
  }

  goToNextStep(): void {
    this.NodeService.getNextNodeId().then((nextNodeId) => {
      this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(nextNodeId);
    });
  }

  updateNode(nodeString: string): void {
    const node = JSON.parse(nodeString);
    this.ProjectService.replaceNode(node.id, node);
    this.ProjectService.parseProject();
    this.StudentDataService.updateNodeStatuses();
  }

  sendStudentWorkToClassmate(workgroupId: number, studentWork: any): void {
    this.rxStomp.publish({
      destination: `/app/api/workgroup/${workgroupId}/student-work`,
      body: JSON.stringify(studentWork)
    });
  }
}
