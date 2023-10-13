import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { SessionService } from '../../../../services/sessionService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { NotificationService } from '../../../../services/notificationService';
import { Notification } from '../../../../../../app/domain/notification';
import { getAvatarColorForWorkgroupId } from '../../../../common/workgroup/workgroup';
import { Router } from '@angular/router';

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  avatarColor: any;
  canAuthorProject: boolean;
  contextPath: string;
  dismissedNotifications: Notification[] = [];
  @Input() logoPath: string;
  newNotifications: Notification[] = [];
  notificationChangedSubscription: Subscription;
  @Input() notifications: any;
  @Input() projectId: number;
  @Input() projectTitle: string;
  @Input() runId: number;
  @Input() runCode: string;
  runInfo: string;
  themePath: string;
  userInfo: any;
  workgroupId: number;

  constructor(
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private notificationService: NotificationService,
    private projectService: TeacherProjectService,
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
    this.themePath = this.projectService.getThemePath();
    this.contextPath = this.configService.getContextPath();
    const permissions = this.configService.getPermissions();
    this.canAuthorProject = permissions.canAuthorProject;
    this.runInfo = this.getRunInfo();
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

  private getRunInfo(): string {
    return $localize`Run ID: ${this.runId} | Access Code: ${this.runCode}`;
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
    this.dismissedNotifications = this.notificationService.getDismissedNotificationsForWorkgroup(
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
      if (/unit\/(\d*)\/node\/(\w*)$/.test(this.router.url)) {
        this.router.navigate([
          '/teacher/edit/unit',
          this.projectId,
          'node',
          this.router.url.match(/\/node\/(\w+)$/)[1]
        ]);
      } else {
        this.router.navigate(['/teacher/edit/unit', this.projectId]);
      }
    }
  }

  protected previewProject(): void {
    window.open(`${this.configService.getConfigParam('previewProjectURL')}`);
  }

  protected goHome(): void {
    this.sessionService.goHome();
  }

  protected logOut(): void {
    this.sessionService.logOut();
  }
}
