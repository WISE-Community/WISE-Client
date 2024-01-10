import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Notification } from '../../../../app/domain/notification';
import { NotebookService } from '../../services/notebookService';
import { NotificationService } from '../../services/notificationService';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';

@Component({
  selector: 'notifications-dialog',
  templateUrl: './notifications-dialog.component.html',
  styleUrls: ['./notifications-dialog.component.scss']
})
export class NotificationsDialogComponent implements OnInit {
  newNotifications: any;
  notifications: any;
  subscriptions: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NotificationsDialogComponent>,
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

  dismissNotificationAggregateAndVisitNode(notificationAggregate: any): void {
    if (notificationAggregate != null && notificationAggregate.notifications != null) {
      for (const notification of notificationAggregate.notifications) {
        if (notification.data == null || notification.data.dismissCode == null) {
          // only dismiss notifications that don't require a dismiss code,
          // but still allow them to move to the node
          this.dismissNotification(notification);
        }
      }
    }

    let goToNodeId = notificationAggregate.nodeId;
    let notebookItemId = notificationAggregate.notebookItemId;
    if (goToNodeId != null) {
      this.studentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(goToNodeId);
      this.dialogRef.close();
    } else if (notebookItemId != null) {
      // assume notification with notebookItemId is for the report for now,
      // as we don't currently support annotations on notes
      this.notebookService.broadcastShowReportAnnotations();
      this.dialogRef.close();
    }
  }

  private dismissNotification(notification: Notification, showDismissCode: boolean = true): any {
    if (this.canDismissWithoutCode(notification)) {
      this.notificationService.dismissNotification(notification);
    } else if (showDismissCode) {
      // ask user to input dismiss code before dismissing it
      let args = {
        notification: notification
      };
      this.notificationService.broadcastViewCurrentAmbientNotification(args);
      this.dialogRef.close();
    }
  }

  dismissNotificationAggregate(notificationAggregate: any, showDismissCode: boolean = true): void {
    if (notificationAggregate != null && notificationAggregate.notifications != null) {
      for (const notification of notificationAggregate.notifications) {
        this.dismissNotification(notification, showDismissCode);
      }
    }
  }

  dismissAll(): void {
    if (confirm($localize`Are you sure you want to dismiss all your alerts?`)) {
      for (const notificationAggregate of this.newNotifications) {
        this.dismissNotificationAggregate(notificationAggregate, false);
      }
    }
  }

  getNodePositionAndTitle(nodeId: string): string {
    return this.projectService.getNodePositionAndTitle(nodeId);
  }

  private canDismissWithoutCode(notification: Notification): boolean {
    return notification.data == null || notification.data.dismissCode == null;
  }
}
