import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Notification } from '../../../../app/domain/notification';
import { NotebookService } from '../../services/notebookService';
import { NotificationService } from '../../services/notificationService';
import { ProjectService } from '../../services/projectService';
import { NodeService } from '../../services/nodeService';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  standalone: true,
  styleUrl: './notifications-dialog.component.scss',
  templateUrl: './notifications-dialog.component.html'
})
export class NotificationsDialogComponent implements OnInit {
  newNotifications: any;
  protected notifications: any;
  private subscriptions: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NotificationsDialogComponent>,
    private nodeService: NodeService,
    private notebookService: NotebookService,
    private notificationService: NotificationService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.notificationService.notificationChanged$.subscribe(() => {
        this.newNotifications = this.notificationService.getNewNotifications();
      })
    );
    this.newNotifications = this.notificationService.getNewNotifications();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected hasNewNotifications(): boolean {
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
      this.nodeService.setCurrentNode(goToNodeId);
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

  protected getNodePositionAndTitle(nodeId: string): string {
    return this.projectService.getNodePositionAndTitle(nodeId);
  }

  private canDismissWithoutCode(notification: Notification): boolean {
    return notification.data == null || notification.data.dismissCode == null;
  }
}
