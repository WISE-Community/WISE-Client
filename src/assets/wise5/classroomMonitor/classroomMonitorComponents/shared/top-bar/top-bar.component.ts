import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { SessionService } from '../../../../services/sessionService';
import { NotificationService } from '../../../../services/notificationService';
import { Notification } from '../../../../../../app/domain/notification';
import { getAvatarColorForWorkgroupId } from '../../../../common/workgroup/workgroup';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { NotificationsMenuComponent } from '../notifications-menu/notifications-menu.component';
import { PauseScreensMenuComponent } from '../../pause-screens-menu/pause-screens-menu.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule,
    NotificationsMenuComponent,
    PauseScreensMenuComponent
  ],
  selector: 'top-bar',
  styleUrl: './top-bar.component.scss',
  templateUrl: './top-bar.component.html'
})
export class TopBarComponent implements OnInit {
  protected avatarColor: any;
  protected canAuthorProject: boolean;
  protected contextPath: string;
  @Input() logoPath: string;
  protected newNotifications: Notification[] = [];
  private notificationChangedSubscription: Subscription;
  @Input() notifications: any;
  @Input() projectId: number;
  @Input() projectTitle: string;
  @Input() runId: number;
  @Input() runCode: string;
  protected runInfo: string;
  protected userInfo: any;
  private workgroupId: number;

  constructor(
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private notificationService: NotificationService,
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.workgroupId = this.configService.getWorkgroupId();
    if (this.workgroupId == null) {
      this.workgroupId = 100 * Math.random();
    }
    this.avatarColor = getAvatarColorForWorkgroupId(this.workgroupId);
    this.userInfo = this.configService.getMyUserInfo();
    this.notificationChangedSubscription = this.notificationService.notificationChanged$.subscribe(
      () => {
        this.setNotifications();
      }
    );
    this.contextPath = this.configService.getContextPath();
    const permissions = this.configService.getPermissions();
    this.canAuthorProject = permissions.canAuthorProject;
    this.runInfo = $localize`Run ID: ${this.runId} | Access Code: ${this.runCode}`;
    this.setNotifications();
  }

  ngOnDestroy(): void {
    this.notificationChangedSubscription.unsubscribe();
  }

  ngOnChanges(changesObj: SimpleChanges): void {
    if (changesObj.notifications) {
      this.setNotifications();
    }
  }

  /**
   * Find all teacher notifications and separate into new and dismissed arrays
   * TODO: move to TeacherDataService?
   */
  private setNotifications(): void {
    // TODO: take into account shared teacher users!
    this.newNotifications = this.notificationService.getLatestActiveNotificationsFromUniqueSource(
      this.notifications,
      this.workgroupId
    );
  }

  protected isAnyPeriodPaused(): boolean {
    return this.dataService.getPeriods().some((period) => period.paused);
  }

  protected switchToAuthoringView(): void {
    if (
      confirm(
        $localize`Warning! You will be editing the content of a classroom unit. If students have already started working, this may result in lost data or other problems.\n\nAre you sure you want to proceed?`
      )
    ) {
      const urlFragments = ['/teacher/edit/unit', this.projectId];
      if (this.isViewingNode()) {
        urlFragments.push('node', this.getCurrentNodeId());
      }
      this.router.navigate(urlFragments);
    }
  }

  private isViewingNode(): boolean {
    return /unit\/(\d*)\/node\/(\w*)$/.test(this.router.url);
  }

  private getCurrentNodeId(): string {
    return this.router.url.match(/\/node\/(\w+)$/)[1];
  }

  protected previewProject(): void {
    window.open(this.dataService.getPreviewUrl());
  }

  protected goHome(): void {
    this.sessionService.goHome();
  }

  protected logOut(): void {
    this.sessionService.logOut();
  }
}
