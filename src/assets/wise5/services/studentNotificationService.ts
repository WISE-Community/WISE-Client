import { inject, Injectable } from '@angular/core';
import { Message } from '@stomp/stompjs';
import { Notification } from '../../../app/domain/notification';
import { NotificationService } from './notificationService';
import { StompService } from './stompService';
import { StudentDataService } from './studentDataService';

@Injectable()
export class StudentNotificationService extends NotificationService {
  private dataService = inject(StudentDataService);
  private stompService = inject(StompService);

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
      notification.nodeId === this.dataService.getCurrentNodeId() &&
      notification.type === 'PeerChatMessage'
    );
  }
}
