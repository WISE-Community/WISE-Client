import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnnotationService } from '../../services/annotationService';
import { NotebookService } from '../../services/notebookService';
import { NotificationService } from '../../services/notificationService';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';

@Component({
  selector: 'notifications-menu',
  templateUrl: './notifications-menu.component.html',
  styleUrls: ['./notifications-menu.component.scss']
})
export class NotificationsMenuComponent implements OnInit {
  newNotifications: any;
  notifications: any;
  subscriptions: Subscription = new Subscription();

  constructor(
    private annotationService: AnnotationService,
    private notebookService: NotebookService,
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private studentDataService: StudentDataService
  ) {}

  ngOnInit(): void {
    this.notifications = this.notificationService.notifications;
    this.subscriptions.add(
      this.notificationService.notificationChanged$.subscribe(() => {
        // update new notifications
        this.notifications = this.notificationService.notifications;
        this.newNotifications = this.getNewNotifications();
      })
    );
    this.newNotifications = this.getNewNotifications();
  }

  getNewNotifications(): any[] {
    let newNotificationAggregates = [];
    for (const notification of this.notifications) {
      if (notification.timeDismissed == null) {
        let notificationNodeId = notification.nodeId;
        let notificationType = notification.type;
        let newNotificationForNodeIdAndTypeExists = false;
        for (const newNotificationAggregate of newNotificationAggregates) {
          if (
            newNotificationAggregate.nodeId == notificationNodeId &&
            newNotificationAggregate.type == notificationType
          ) {
            newNotificationForNodeIdAndTypeExists = true;
            newNotificationAggregate.notifications.push(notification);
            if (notification.timeGenerated > newNotificationAggregate.latestNotificationTimestamp) {
              newNotificationAggregate.latestNotificationTimestamp = notification.timeGenerated;
            }
          }
        }
        let notebookItemId = null; // if this notification was created because teacher commented on a notebook report.
        if (!newNotificationForNodeIdAndTypeExists) {
          let message = '';
          if (notificationType === 'DiscussionReply') {
            message = $localize`You have new replies to your discussion post!`;
          } else if (notificationType === 'teacherToStudent') {
            message = $localize`You have new feedback from your teacher!`;
            if (notification.data != null) {
              if (typeof notification.data === 'string') {
                notification.data = JSON.parse(notification.data);
              }

              if (notification.data.annotationId != null) {
                let annotation = this.annotationService.getAnnotationById(
                  notification.data.annotationId
                );
                if (annotation != null && annotation.notebookItemId != null) {
                  notebookItemId = annotation.notebookItemId;
                }
              }
            }
          } else if (notificationType === 'CRaterResult') {
            message = $localize`You have new feedback!`;
          }
          const newNotificationAggregate = {
            latestNotificationTimestamp: notification.timeGenerated,
            message: message,
            nodeId: notificationNodeId,
            notebookItemId: notebookItemId,
            notifications: [notification],
            type: notificationType
          };
          newNotificationAggregates.push(newNotificationAggregate);
        }
      }
    }

    // sort the aggregates by latestNotificationTimestamp, latest -> oldest
    newNotificationAggregates.sort((n1, n2) => {
      return n2.latestNotificationTimestamp - n1.latestNotificationTimestamp;
    });
    return newNotificationAggregates;
  }

  hasNewNotifications(): boolean {
    return this.newNotifications.length > 0;
  }

  dismissNotificationAggregateAndVisitNode(event: any, notificationAggregate: any): void {
    if (notificationAggregate != null && notificationAggregate.notifications != null) {
      for (const notification of notificationAggregate.notifications) {
        if (notification.data == null || notification.data.dismissCode == null) {
          // only dismiss notifications that don't require a dismiss code,
          // but still allow them to move to the node
          this.dismissNotification(event, notification);
        }
      }
    }

    let goToNodeId = notificationAggregate.nodeId;
    let notebookItemId = notificationAggregate.notebookItemId;
    if (goToNodeId != null) {
      this.studentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(goToNodeId);
    } else if (notebookItemId != null) {
      // assume notification with notebookItemId is for the report for now,
      // as we don't currently support annotations on notes
      this.notebookService.broadcastShowReportAnnotations();
    }
  }

  dismissNotification(event: any, notification: any): any {
    if (notification.data == null || notification.data.dismissCode == null) {
      this.notificationService.dismissNotification(notification);
    } else {
      // ask user to input dismiss code before dismissing it
      let args = {
        event: event,
        notification: notification
      };
      this.notificationService.broadcastViewCurrentAmbientNotification(args);
    }
  }

  dismissNotificationAggregate(event: any, notificationAggregate: any): void {
    if (notificationAggregate != null && notificationAggregate.notifications != null) {
      for (const notification of notificationAggregate.notifications) {
        this.dismissNotification(event, notification);
      }
    }
  }

  getNodePositionAndTitleByNodeId(nodeId: string): string {
    return this.projectService.getNodePositionAndTitleByNodeId(nodeId);
  }
}
