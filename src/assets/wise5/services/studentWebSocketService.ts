'use strict';

import { Injectable } from '@angular/core';
import { AnnotationService } from './annotationService';
import { ConfigService } from './configService';
import { TagService } from './tagService';
import { StudentDataService } from './studentDataService';
import { NodeService } from './nodeService';
import { NotificationService } from './notificationService';
import { ProjectService } from './projectService';
import * as angular from 'angular';
import { Notification } from '../../../app/domain/notification';
import { Message } from '@stomp/stompjs';
import { RxStomp } from '@stomp/rx-stomp';

@Injectable()
export class StudentWebSocketService {
  rxStomp: RxStomp;

  constructor(
    private AnnotationService: AnnotationService,
    private ConfigService: ConfigService,
    private NodeService: NodeService,
    private NotificationService: NotificationService,
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
          this.StudentDataService.pauseScreen(true);
        } else if (body.type === 'unpause') {
          this.StudentDataService.pauseScreen(false);
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
          this.StudentDataService.handleAnnotationReceived(annotationData);
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
          this.StudentDataService.broadcastStudentWorkReceived(body.studentWork);
        }
      });
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
    const node = angular.fromJson(nodeString);
    this.ProjectService.replaceNode(node.id, node);
    this.ProjectService.parseProject();
    this.StudentDataService.updateNodeStatuses();
  }

  sendMessageToClassmate(workgroupId: number, message: any): void {
    this.rxStomp.publish({
      destination: `/topic/workgroup/${workgroupId}`,
      body: JSON.stringify(message)
    });
  }
}
