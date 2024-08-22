import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, filter } from 'rxjs';
import { Notification } from '../../../app/domain/notification';
import { DialogWithConfirmComponent } from '../directives/dialog-with-confirm/dialog-with-confirm.component';
import { ConfigService } from '../services/configService';
import { NodeService } from '../services/nodeService';
import { NotebookService } from '../services/notebookService';
import { NotificationService } from '../services/notificationService';
import { SessionService } from '../services/sessionService';
import { TeacherDataService } from '../services/teacherDataService';
import { TeacherProjectService } from '../services/teacherProjectService';
import { TeacherPauseScreenService } from '../services/teacherPauseScreenService';
import { NavigationEnd, Router } from '@angular/router';
import { RunStatusService } from '../services/runStatusService';

@Component({
  selector: 'classroom-monitor',
  styleUrls: ['./classroom-monitor.component.scss'],
  templateUrl: './classroom-monitor.component.html'
})
export class ClassroomMonitorComponent implements OnInit {
  logoPath: string;
  menuOpen: boolean;
  notebookConfig: any;
  notifications: Notification[];
  projectId: number;
  projectTitle: string;
  reportEnabled: boolean;
  reportFullscreen: boolean;
  runCode: string;
  runId: number;
  showPeriodSelect: boolean;
  subscriptions: Subscription = new Subscription();
  title: string = $localize`Classroom Monitor`;
  views: any[];
  workgroupId: number;

  constructor(
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private dialog: MatDialog,
    private nodeService: NodeService,
    private notebookService: NotebookService,
    private notificationService: NotificationService,
    private pauseScreenService: TeacherPauseScreenService,
    private projectService: TeacherProjectService,
    private router: Router,
    private runStatusService: RunStatusService,
    private sessionService: SessionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.logoPath = this.projectService.getThemePath() + '/images/WISE-logo-ffffff.svg';
    this.notifications = this.notificationService.notifications;
    this.projectId = this.configService.getProjectId();
    this.projectTitle = this.projectService.getProjectTitle();
    this.runCode = this.configService.getRunCode();
    this.runId = this.configService.getRunId();
    this.initializeNotebook();
    this.initializeViews();
    this.subscribeToServerConnectionStatus();
    this.subscribeToSessionWarning();
    this.subscribeToNotebookFullScreen();
    this.subscribeToRouterEvents();
    this.processUI();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.dataService.clearCurrentPeriod();
  }

  private initializeNotebook(): void {
    if (this.notebookService.isNotebookEnabled('teacherNotebook')) {
      this.notebookConfig = this.notebookService.getTeacherNotebookConfig();
      this.reportEnabled =
        this.notebookConfig.enabled && this.notebookConfig.itemTypes.report.enabled;
    }
  }

  private initializeViews(): void {
    this.views = [
      {
        route: ['milestones'],
        name: $localize`Milestones`,
        icon: 'flag',
        type: 'primary',
        active: this.projectService.getAchievements().isEnabled
      },
      {
        route: ['.'],
        name: $localize`Grade by Step`,
        icon: 'view_list',
        type: 'primary',
        action: () => {
          if (this.dataService.getCurrentNode() !== this.projectService.rootNode) {
            // we are not showing the root project view so go to the parent of the current node
            this.nodeService.closeNode();
          }
        },
        active: true
      },
      {
        route: ['team'],
        name: $localize`Grade by Student`,
        icon: 'people',
        type: 'primary',
        active: true
      },
      {
        route: ['manage-students'],
        name: $localize`Manage Students`,
        icon: 'face',
        type: 'primary',
        active: true
      },
      {
        route: ['notebook'],
        name: $localize`Student Notebooks`,
        icon: 'chrome_reader_mode',
        type: 'primary',
        active: this.notebookService.isNotebookEnabled()
      },
      {
        route: ['export'],
        name: $localize`Data Export`,
        icon: 'file_download',
        type: 'secondary',
        active: true
      }
    ];
  }

  private subscribeToServerConnectionStatus(): void {
    this.subscriptions.add(
      this.notificationService.serverConnectionStatus$.subscribe((isConnected: boolean) => {
        this.toggleServerDisconnectError(!isConnected);
      })
    );
  }

  private subscribeToSessionWarning(): void {
    this.subscriptions.add(
      this.sessionService.showSessionWarning$.subscribe(() => {
        this.dialog
          .open(DialogWithConfirmComponent, {
            data: {
              content: $localize`You have been inactive for a long time. Do you want to stay logged in?`,
              title: $localize`Session Timeout`
            }
          })
          .afterClosed()
          .subscribe((renewSession: boolean) => {
            if (renewSession) {
              this.sessionService.closeWarningAndRenewSession();
            } else {
              this.logOut();
            }
          });
      })
    );
  }

  private subscribeToNotebookFullScreen(): void {
    this.subscriptions.add(
      this.notebookService.reportFullScreen$.subscribe((full: boolean) => {
        this.reportFullscreen = full;
      })
    );
  }

  private subscribeToRouterEvents(): void {
    this.subscriptions.add(
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        this.processUI();
      })
    );
  }

  private processUI(): void {
    this.menuOpen = false;
  }

  protected toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  private toggleServerDisconnectError(show: boolean): void {
    if (show) {
      this.snackBar.open(
        $localize`Error: Data is not being saved! Check your internet connection.`,
        'Error',
        { duration: 0 }
      );
    } else {
      this.snackBar.dismiss();
    }
  }

  private logOut(): void {
    this.sessionService.logOut();
  }

  @HostListener('window:beforeunload')
  protected unPauseAllPeriods(): void {
    this.runStatusService.getRunStatus().periods.forEach((period) => {
      if (period.periodId !== -1 && period.paused) {
        this.pauseScreenService.pauseScreensChanged(period.periodId, false);
      }
    });
  }

  @HostListener('document:mousemove')
  protected renewSession(): void {
    this.sessionService.mouseMoved();
  }
}
