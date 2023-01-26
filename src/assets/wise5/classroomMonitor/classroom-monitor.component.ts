import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpgradeModule } from '@angular/upgrade/static';
import { Subscription } from 'rxjs';
import { Notification } from '../../../app/domain/notification';
import { DialogWithConfirmComponent } from '../directives/dialog-with-confirm/dialog-with-confirm.component';
import { ConfigService } from '../services/configService';
import { NodeService } from '../services/nodeService';
import { NotebookService } from '../services/notebookService';
import { NotificationService } from '../services/notificationService';
import { SessionService } from '../services/sessionService';
import { TeacherDataService } from '../services/teacherDataService';
import { TeacherProjectService } from '../services/teacherProjectService';

@Component({
  selector: 'classroom-monitor',
  templateUrl: './classroom-monitor.component.html'
})
export class ClassroomMonitorComponent implements OnInit {
  currentViewName: string;
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
  showGradeByStepTools: boolean;
  showGradeByTeamTools: boolean;
  showPeriodSelect: boolean;
  subscriptions: Subscription = new Subscription();
  title: string = $localize`Classroom Monitor`;
  views: any[];
  workgroupId: number;
  $state: any;

  constructor(
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private dialog: MatDialog,
    private nodeService: NodeService,
    private notebookService: NotebookService,
    private notificationService: NotificationService,
    private projectService: TeacherProjectService,
    private sessionService: SessionService,
    private snackBar: MatSnackBar,
    private upgrade: UpgradeModule
  ) {
    this.$state = this.upgrade.$injector.get('$state');
  }

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
    this.subscribeToTransitions();
    this.processUI();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
        route: 'root.cm.milestones',
        name: $localize`Milestones`,
        icon: 'flag',
        type: 'primary',
        active: this.projectService.getAchievements().isEnabled
      },
      {
        route: 'root.cm.unit',
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
        route: 'root.cm.teamLanding',
        name: $localize`Grade by Team`,
        icon: 'people',
        type: 'primary',
        active: true
      },
      {
        route: 'root.cm.manageStudents',
        name: $localize`Manage Students`,
        icon: 'face',
        type: 'primary',
        active: true
      },
      {
        route: 'root.cm.notebooks',
        name: $localize`Student Notebooks`,
        icon: 'chrome_reader_mode',
        type: 'primary',
        active: this.notebookService.isNotebookEnabled()
      },
      {
        route: 'root.cm.export',
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

  private subscribeToTransitions(): void {
    this.upgrade.$injector.get('$transitions').onSuccess({}, () => {
      this.menuOpen = false;
      this.processUI();
    });
  }

  /**
   * Update UI items based on state, show or hide relevant menus and toolbars
   * TODO: remove/rework this and put items in their own ui states?
   */
  private processUI(): void {
    const viewName = this.$state.$current.name;
    const currentView = this.views.find((view: any) => view.route === viewName);
    if (currentView) {
      this.currentViewName = currentView.name;
    }
    this.showGradeByStepTools = false;
    this.showGradeByTeamTools = false;
    this.showPeriodSelect = true;
    this.workgroupId = null;
    if (viewName === 'root.cm.unit.node') {
      let nodeId = this.$state.params.nodeId;
      this.showGradeByStepTools = this.projectService.isApplicationNode(nodeId);
    } else if (viewName === 'root.cm.team') {
      this.workgroupId = parseInt(this.$state.params.workgroupId);
      this.showGradeByTeamTools = true;
    } else if (viewName === 'root.cm.export') {
      this.showPeriodSelect = false;
    }
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
    this.saveEvent('logOut', 'Navigation').then(() => {
      this.sessionService.logOut();
    });
  }

  private saveEvent(eventName: string, category: string): Promise<any> {
    return this.dataService
      .saveEvent('ClassroomMonitor', null, null, null, category, eventName, {})
      .then((result) => {
        return result;
      });
  }

  @HostListener('window:beforeunload')
  protected unPauseAllPeriods(): void {
    this.dataService.getRunStatus().periods.forEach((period) => {
      if (period.periodId !== -1 && period.paused) {
        this.dataService.pauseScreensChanged(period.periodId, false);
      }
    });
  }

  @HostListener('document:mousemove')
  protected renewSession(): void {
    this.sessionService.mouseMoved();
  }
}
