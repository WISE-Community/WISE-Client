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
    private notebookService: NotebookService,
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private studentDataService: StudentDataService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.notificationService.notificationChanged$.subscribe(() => {
        // update new notifications
        this.newNotifications = this.notificationService.getNewNotifications();
      })
    );
    this.newNotifications = this.notificationService.getNewNotifications();
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
