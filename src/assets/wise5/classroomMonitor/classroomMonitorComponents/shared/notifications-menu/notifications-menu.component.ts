import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../services/notificationService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { DialogWithConfirmComponent } from '../../../../../../assets/wise5/directives/dialog-with-confirm/dialog-with-confirm.component';
import { Notification } from '../../../../../../app/domain/notification';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  selector: 'notifications-menu',
  styleUrl: './notifications-menu.component.scss',
  templateUrl: './notifications-menu.component.html'
})
export class NotificationsMenuComponent {
  @Input() newNotifications: Notification[] = [];
  @Input() state: any;

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  protected getNodePositionAndTitle(nodeId: string): string {
    return this.projectService.getNodePositionAndTitle(nodeId);
  }

  protected confirmDismissAllNotifications(): void {
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

  protected dismissNotification(notification: Notification): void {
    this.notificationService.dismissNotification(notification);
  }

  protected visitNode(notification: Notification): void {
    this.router.navigate(['node', notification.nodeId], {
      relativeTo: this.route
    });
  }
}
