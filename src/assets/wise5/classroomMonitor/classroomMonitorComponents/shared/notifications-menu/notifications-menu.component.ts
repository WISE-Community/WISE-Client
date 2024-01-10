import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../services/notificationService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { DialogWithConfirmComponent } from '../../../../../../assets/wise5/directives/dialog-with-confirm/dialog-with-confirm.component';
import { Notification } from '../../../../../../app/domain/notification';

@Component({
  selector: 'notifications-menu',
  templateUrl: './notifications-menu.component.html',
  styleUrls: ['./notifications-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationsMenuComponent implements OnInit {
  @Input() newNotifications: Notification[] = [];
  @Input() state: any;
  @Input() withPause: boolean;

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {}

  getNodePositionAndTitle(nodeId: string): string {
    return this.projectService.getNodePositionAndTitle(nodeId);
  }

  confirmDismissAllNotifications(): void {
    this.dialog
      .open(DialogWithConfirmComponent, {
        data: {
          content: $localize`Are you sure you want to clear all your alerts?`,
          title: $localize`Clear all alerts`
        }
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.dismissAllNotifications();
        }
      });
  }

  private dismissAllNotifications(): void {
    this.newNotifications.map((newNotification: Notification) => {
      this.dismissNotification(newNotification);
    });
  }

  dismissNotification(notification: Notification): void {
    this.notificationService.dismissNotification(notification);
  }

  visitNode(notification: Notification): void {
    this.state.go('root.cm.unit.node', { nodeId: notification.nodeId });
  }
}
