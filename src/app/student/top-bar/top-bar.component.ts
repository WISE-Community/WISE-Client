import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { ConstraintService } from '../../../assets/wise5/services/constraintService';
import { NodeStatusService } from '../../../assets/wise5/services/nodeStatusService';
import { NotificationService } from '../../../assets/wise5/services/notificationService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { StudentDataService } from '../../../assets/wise5/services/studentDataService';
import { NotificationsDialogComponent } from '../../../assets/wise5/vle/notifications-dialog/notifications-dialog.component';
import { StudentAccountMenuComponent } from '../../../assets/wise5/vle/student-account-menu/student-account-menu.component';
import { Notification } from '../../domain/notification';
import { getAvatarColorForWorkgroupId } from '../../../assets/wise5/common/workgroup/workgroup';
import { Language } from '../../domain/language';
import { TranslateProjectService } from '../../../assets/wise5/services/translateProjectService';
import { ProjectLocale } from '../../domain/projectLocale';

@Component({
  selector: 'top-bar',
  styleUrls: ['./top-bar.component.scss'],
  templateUrl: 'top-bar.component.html'
})
export class TopBarComponent {
  @ViewChild(StudentAccountMenuComponent) accountMenu: StudentAccountMenuComponent;

  avatarColor: string;
  completionPercent: number;
  protected hasTranslations: boolean;
  homeURL: string;
  isConstraintsDisabled: boolean = false;
  isPreview: boolean = false;
  logoURL: string;
  newNotifications: Notification[] = [];
  notifications: Notification[] = [];
  protected projectLocale: ProjectLocale;
  @Input() projectName: string;
  subscriptions: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private configService: ConfigService,
    private constraintService: ConstraintService,
    private nodeStatusService: NodeStatusService,
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private studentDataService: StudentDataService,
    private translateProjectService: TranslateProjectService
  ) {}

  ngOnInit() {
    this.avatarColor = getAvatarColorForWorkgroupId(this.configService.getWorkgroupId());
    this.logoURL = `${this.projectService.getThemePath()}/images/WISE-logo-ffffff.svg`;
    this.hasTranslations = this.projectService.getLocale().hasTranslations();
    this.isPreview = this.configService.isPreview();
    this.isConstraintsDisabled = !this.configService.getConfigParam('constraints');
    this.projectLocale = this.projectService.getLocale();

    this.setCompletionPercent();
    this.subscribeToStudentData();
    this.processNotifications();
    this.subscribeToNotifications();
    this.setHomeURL();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  hasNewAmbientNotifications(): boolean {
    return this.getNewAmbientNotifications().length > 0;
  }

  private getNewAmbientNotifications(): any[] {
    return this.notifications.filter((notification: Notification) => {
      return (
        notification.timeDismissed == null &&
        notification.data != null &&
        notification.data.isAmbient
      );
    });
  }

  hasNewNotifications(): boolean {
    return this.newNotifications.length > 0;
  }

  protected disableConstraints(): void {
    this.isConstraintsDisabled = true;
    this.constraintService.clearActiveConstraints();
  }

  protected hasConstraints(): boolean {
    return this.constraintService.hasActiveConstraints();
  }

  viewCurrentAmbientNotification($event: any): void {
    const ambientNotifications = this.getNewAmbientNotifications();
    if (ambientNotifications.length) {
      this.notificationService.broadcastViewCurrentAmbientNotification({
        event: $event,
        notification: ambientNotifications[0]
      });
    }
  }

  private setCompletionPercent(): void {
    this.completionPercent = this.nodeStatusService.getNodeStatuses()[
      this.projectService.getProjectRootNode().id
    ].progress.completionPct;
  }

  private subscribeToStudentData(): void {
    this.subscriptions.add(
      this.studentDataService.componentStudentData$.subscribe(() => {
        this.setCompletionPercent();
      })
    );
  }

  private processNotifications(): void {
    this.notifications = this.notificationService.notifications;
    this.newNotifications = this.notificationService.getNewNotifications();
  }

  private subscribeToNotifications(): void {
    this.subscriptions.add(
      this.notificationService.notificationChanged$.subscribe(() => {
        this.processNotifications();
      })
    );
  }

  viewAlerts($event: any): void {
    $event.stopPropagation();
    this.dialog.open(NotificationsDialogComponent, {
      panelClass: 'dialog-sm',
      autoFocus: false
    });
  }

  private setHomeURL(): void {
    const userType = this.configService.getConfigParam('userType');
    if (userType === 'student') {
      this.homeURL = '/student';
    } else if (userType === 'teacher') {
      this.homeURL = '/teacher';
    } else {
      this.homeURL = '/';
    }
  }

  protected changeLanguage(language: Language): void {
    this.translateProjectService.translate(language.locale);
  }
}
