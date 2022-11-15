import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Message } from '@stomp/stompjs';
import { AnnotationService } from './annotationService';
import { ConfigService } from './configService';
import { Notification } from '../../../app/domain/notification';
import { NotificationService } from './notificationService';
import { ProjectService } from './projectService';
import { StompService } from './stompService';
import { StudentDataService } from './studentDataService';

@Injectable()
export class StudentNotificationService extends NotificationService {
  constructor(
    protected annotationService: AnnotationService,
    protected dialog: MatDialog,
    protected http: HttpClient,
    protected configService: ConfigService,
    protected projectService: ProjectService,
    private stompService: StompService,
    private studentDataService: StudentDataService
  ) {
    super(annotationService, dialog, http, configService, projectService);
  }

  initialize(): void {
    this.subscribeToNotificationMessages();
  }

  private subscribeToNotificationMessages(): void {
    this.stompService.workgroupMessage$.subscribe((message: Message) => {
      const body = JSON.parse(message.body);
      if (body.type === 'notification') {
        const notification = JSON.parse(body.content);
        this.addNotification(notification);
        if (this.isDismissImmediately(notification)) {
          this.dismissNotification(notification);
        }
      }
    });
  }

  private isDismissImmediately(notification: Notification): boolean {
    return (
      notification.nodeId === this.studentDataService.getCurrentNodeId() &&
      notification.type === 'PeerChatMessage'
    );
  }
}
