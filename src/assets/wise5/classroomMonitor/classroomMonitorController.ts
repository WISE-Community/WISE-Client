'use strict';

import { ConfigService } from '../services/configService';
import { NodeService } from '../services/nodeService';
import { NotebookService } from '../services/notebookService';
import { NotificationService } from '../services/notificationService';
import { TeacherDataService } from '../services/teacherDataService';
import { SessionService } from '../services/sessionService';
import * as angular from 'angular';
import { TeacherProjectService } from '../services/teacherProjectService';
import { Directive } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive()
class ClassroomMonitorController {
  $translate: any;
  connectionLostDisplay: any;
  connectionLostShown: boolean;
  currentViewName: string;
  enableProjectAchievements: boolean;
  logoPath: string;
  menuOpen: boolean = false;
  notebookConfig: any;
  notifications: any;
  projectId: number;
  projectTitle: string;
  reportEnabled: boolean = false;
  reportFullscreen: boolean = false;
  runId: number;
  runCode: string;
  showGradeByStepTools: boolean = false;
  showGradeByTeamTools: boolean;
  showPeriodSelect: boolean = false;
  showSideMenu: boolean = true;
  showToolbar: boolean = true;
  themePath: string;
  title: string = 'Classroom Monitor';
  views: any;
  workgroupId: number;
  subscriptions: Subscription = new Subscription();

  static $inject = [
    '$filter',
    '$mdDialog',
    '$mdToast',
    '$scope',
    '$state',
    '$transitions',
    '$window',
    'ConfigService',
    'NodeService',
    'NotebookService',
    'NotificationService',
    'ProjectService',
    'SessionService',
    'TeacherDataService'
  ];

  constructor(
    $filter,
    private $mdDialog: any,
    private $mdToast: any,
    private $scope: any,
    private $state: any,
    $transitions: any,
    private $window: any,
    private ConfigService: ConfigService,
    private NodeService: NodeService,
    private NotebookService: NotebookService,
    private NotificationService: NotificationService,
    private ProjectService: TeacherProjectService,
    private SessionService: SessionService,
    private TeacherDataService: TeacherDataService
  ) {
    this.$translate = $filter('translate');
    this.projectTitle = this.ProjectService.getProjectTitle();
    this.projectId = this.ConfigService.getProjectId();
    this.runId = this.ConfigService.getRunId();
    this.runCode = this.ConfigService.getRunCode();
    if (this.NotebookService.isNotebookEnabled('teacherNotebook')) {
      this.notebookConfig = this.NotebookService.getTeacherNotebookConfig();
      this.reportEnabled =
        this.notebookConfig.enabled && this.notebookConfig.itemTypes.report.enabled;
    }
    this.enableProjectAchievements = this.ProjectService.getAchievements().isEnabled;
    this.views = [
      {
        route: 'root.cm.dashboard',
        name: this.$translate('dashboard'),
        icon: 'dashboard',
        type: 'primary',
        active: false
      },
      {
        route: 'root.cm.milestones',
        name: this.$translate('milestones'),
        icon: 'flag',
        type: 'primary',
        active: this.enableProjectAchievements
      },
      {
        route: 'root.cm.unit',
        name: this.$translate('gradeByStep'),
        icon: 'view_list',
        type: 'primary',
        action: () => {
          if (this.TeacherDataService.getCurrentNode() !== this.ProjectService.rootNode) {
            // we are not showing the root project view so go to the parent of the current node
            this.NodeService.closeNode();
          }
        },
        active: true
      },
      {
        route: 'root.cm.teamLanding',
        name: this.$translate('gradeByTeam'),
        icon: 'people',
        type: 'primary',
        active: true
      },
      {
        route: 'root.cm.manageStudents',
        name: this.$translate('manageStudents'),
        icon: 'face',
        type: 'primary',
        active: true
      },
      {
        route: 'root.cm.notebooks',
        name: this.$translate('studentNotebooks'),
        icon: 'chrome_reader_mode',
        type: 'primary',
        active: this.NotebookService.isNotebookEnabled()
      },
      {
        route: 'root.cm.export',
        name: this.$translate('dataExport'),
        icon: 'file_download',
        type: 'secondary',
        active: true
      }
    ];

    this.connectionLostDisplay = this.$mdToast.build({
      template: `<md-toast>
                        <span>{{ ::'ERROR_CHECK_YOUR_INTERNET_CONNECTION' | translate }}</span>
                      </md-toast>`,
      hideDelay: 0
    });
    this.connectionLostShown = false;

    this.subscriptions.add(
      this.SessionService.showSessionWarning$.subscribe(() => {
        const confirm = $mdDialog
          .confirm()
          .parent(angular.element(document.body))
          .theme('cm')
          .title(this.$translate('SESSION_TIMEOUT'))
          .content(this.$translate('SESSION_TIMEOUT_MESSAGE'))
          .ariaLabel(this.$translate('SESSION_TIMEOUT'))
          .ok(this.$translate('YES'))
          .cancel(this.$translate('NO'));
        $mdDialog.show(confirm).then(
          () => {
            this.SessionService.closeWarningAndRenewSession();
          },
          () => {
            this.logOut();
          }
        );
      })
    );

    this.subscriptions.add(
      this.SessionService.logOut$.subscribe(() => {
        this.logOut();
      })
    );

    $transitions.onSuccess({}, ($transition) => {
      this.menuOpen = false;
      this.processUI();
    });

    this.subscriptions.add(
      this.NotificationService.serverConnectionStatus$.subscribe((isConnected: boolean) => {
        if (isConnected) {
          this.handleServerReconnect();
        } else {
          this.handleServerDisconnect();
        }
      })
    );

    this.subscriptions.add(
      this.NotebookService.reportFullScreen$.subscribe((full: boolean) => {
        this.reportFullscreen = full;
      })
    );

    // TODO: make dynamic, set somewhere like in config?
    this.logoPath = this.ProjectService.getThemePath() + '/images/WISE-logo-ffffff.svg';
    this.processUI();
    this.themePath = this.ProjectService.getThemePath();
    this.notifications = this.NotificationService.notifications;

    const context = 'ClassroomMonitor',
      nodeId = null,
      componentId = null,
      componentType = null,
      category = 'Navigation',
      event = 'sessionStarted',
      data = {};
    this.TeacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      event,
      data
    );

    this.$window.onbeforeunload = () => {
      const periods = this.TeacherDataService.getRunStatus().periods;
      if (periods != null) {
        for (var p = 0; p < periods.length; p++) {
          const period = periods[p];
          if (period != null && period.periodId !== -1 && period.paused) {
            this.TeacherDataService.pauseScreensChanged(period.periodId, false);
          }
        }
      }
    };

    this.$scope.$on('$destroy', () => {
      this.ngOnDestroy();
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Update UI items based on state, show or hide relevant menus and toolbars
   * TODO: remove/rework this and put items in their own ui states?
   */
  processUI() {
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
      this.showGradeByStepTools = this.ProjectService.isApplicationNode(nodeId);
    } else if (viewName === 'root.cm.team') {
      this.workgroupId = parseInt(this.$state.params.workgroupId);
      this.showGradeByTeamTools = true;
    } else if (viewName === 'root.cm.export') {
      this.showPeriodSelect = false;
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  mouseMoved() {
    this.SessionService.mouseMoved();
  }

  handleServerDisconnect() {
    if (!this.connectionLostShown) {
      this.$mdToast.show(this.connectionLostDisplay);
      this.connectionLostShown = true;
    }
  }

  handleServerReconnect() {
    this.$mdToast.hide(this.connectionLostDisplay);
    this.connectionLostShown = false;
  }

  logOut() {
    this.saveEvent('logOut', 'Navigation').then(() => {
      this.SessionService.logOut();
    });
  }

  saveEvent(eventName, category): any {
    const context = 'ClassroomMonitor';
    const nodeId = null;
    const componentId = null;
    const componentType = null;
    const data = {};
    return this.TeacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      eventName,
      data
    ).then((result) => {
      return result;
    });
  }
}

export default ClassroomMonitorController;
