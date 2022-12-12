import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { SessionService } from '../../../../services/sessionService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { NotificationService } from '../../../../services/notificationService';
import { Notification } from '../../../../../../app/domain/notification';
import { UpgradeModule } from '@angular/upgrade/static';

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
  state: any;
  themePath: string;
  userInfo: any;
  workgroupId: number;

  constructor(
    private configService: ConfigService,
    private notificationService: NotificationService,
    private projectService: TeacherProjectService,
    private teacherDataService: TeacherDataService,
    private sessionService: SessionService,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit(): void {
    this.workgroupId = this.configService.getWorkgroupId();
    if (this.workgroupId == null) {
      this.workgroupId = 100 * Math.random();
    }
    this.avatarColor = this.configService.getAvatarColorForWorkgroupId(this.workgroupId);
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
    this.state = this.upgrade.$injector.get('$state');
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

  /**
   * Check whether any period in the run is paused
   * @return Boolean whether any of the periods are paused
   */
  isAnyPeriodPaused(): boolean {
    return this.teacherDataService.isAnyPeriodPaused();
  }

  switchToAuthoringView(): void {
    if (
      confirm(
        $localize`Warning! You will be editing the content of a classroom unit. If students have already started working, this may result in lost data or other problems.\n\nAre you sure you want to proceed?`
      )
    ) {
      this.doAuthoringViewSwitch();
    }
  }

  private doAuthoringViewSwitch(): void {
    const state = this.upgrade.$injector.get('$state');
    if (state.current.name === 'root.cm.notebooks') {
      state.go('root.at.project.notebook', {
        projectId: this.projectId
      });
    } else if (state.current.name === 'root.cm.unit.node') {
      state.go('root.at.project.node', {
        projectId: this.projectId,
        nodeId: state.params.nodeId
      });
    } else {
      state.go('root.at.project', {
        projectId: this.projectId
      });
    }
  }

  previewProject(): void {
    this.saveEvent('projectPreviewed').then(() => {
      window.open(`${this.configService.getConfigParam('previewProjectURL')}`);
    });
  }

  goHome(): void {
    this.saveEvent('goHomeButtonClicked').then(() => {
      this.sessionService.goHome();
    });
  }

  logOut(): void {
    this.saveEvent('logOutButtonClicked').then(() => {
      this.sessionService.logOut();
    });
  }

  private saveEvent(eventName: string): any {
    const context = 'ClassroomMonitor';
    const category = 'Navigation';
    const nodeId = null;
    const componentId = null;
    const componentType = null;
    const data = {};
    return this.teacherDataService
      .saveEvent(context, nodeId, componentId, componentType, category, eventName, data)
      .then((result) => {
        return result;
      });
  }
}
