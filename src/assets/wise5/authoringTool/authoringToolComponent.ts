'use strict';
import { Directive } from '@angular/core';
import * as angular from 'angular';
import { Subscription } from 'rxjs';
import { ConfigService } from '../services/configService';
import { NotificationService } from '../services/notificationService';
import { SessionService } from '../services/sessionService';
import { TeacherDataService } from '../services/teacherDataService';
import { TeacherProjectService } from '../services/teacherProjectService';

@Directive()
class AuthoringToolController {
  $translate: any;
  currentViewName: string;
  isMenuOpen: boolean = false;
  logoPath: string;
  numberProject: boolean = true;
  projectId: number;
  projectTitle: string;
  runId: number;
  runCode: string;
  showStepTools: boolean = false;
  showToolbar: boolean = true;
  title: string = 'Authoring Tool';
  views: any;
  subscriptions: Subscription = new Subscription();

  static $inject = [
    '$anchorScroll',
    '$filter',
    '$mdDialog',
    '$state',
    '$transitions',
    '$timeout',
    'ConfigService',
    'NotificationService',
    'ProjectService',
    'SessionService',
    'TeacherDataService'
  ];

  constructor(
    private $anchorScroll: any,
    $filter,
    private $mdDialog: any,
    private $state: any,
    private $transitions: any,
    private $timeout: any,
    private ConfigService: ConfigService,
    private NotificationService: NotificationService,
    private ProjectService: TeacherProjectService,
    private SessionService: SessionService,
    private TeacherDataService: TeacherDataService
  ) {
    this.$translate = $filter('translate');
  }

  $onInit() {
    this.logoPath = this.ProjectService.getThemePath() + '/images/WISE-logo-ffffff.svg';
    this.views = [
      {
        route: 'root.at.project',
        id: 'projectHomeButton',
        name: this.$translate('projectHome'),
        label: this.$translate('projectHome'),
        icon: 'home',
        type: 'primary',
        showToolbar: true,
        active: true
      },
      {
        route: 'root.at.project.info',
        id: 'infoButton',
        name: this.$translate('PROJECT_INFO'),
        label: this.$translate('PROJECT_INFO'),
        icon: 'info',
        type: 'primary',
        showToolbar: true,
        active: true
      },
      {
        route: 'root.at.project.asset',
        id: 'assetButton',
        name: this.$translate('fileManager'),
        label: this.$translate('fileManager'),
        icon: 'attach_file',
        type: 'primary',
        showToolbar: true,
        active: true
      },
      {
        route: 'root.at.project.notebook',
        id: 'notebookButton',
        name: this.$translate('notebookSettings'),
        label: this.$translate('notebookSettings'),
        icon: 'book',
        type: 'primary',
        showToolbar: true,
        active: true
      },
      {
        route: 'root.at.project.milestones',
        id: 'milestonesButton',
        name: this.$translate('MILESTONES'),
        label: this.$translate('MILESTONES'),
        icon: 'flag',
        type: 'primary',
        showToolbar: true,
        active: true
      },
      {
        route: 'root.at.main',
        id: 'projectListButton',
        name: this.$translate('projectsList'),
        label: this.$translate('projectsList'),
        icon: 'reorder',
        type: 'primary',
        showToolbar: false,
        active: true
      },
      {
        route: 'root.at.project.node',
        name: '',
        label: '',
        icon: '',
        type: 'secondary',
        showToolbar: true,
        active: false
      },
      {
        route: 'root.at.project.node.advanced.branch',
        name: '',
        label: '',
        icon: '',
        type: 'secondary',
        showToolbar: true,
        active: false
      },
      {
        route: 'root.at.project.node.advanced.constraint',
        name: '',
        label: '',
        icon: '',
        type: 'secondary',
        showToolbar: true,
        active: false
      },
      {
        route: 'root.at.project.node.advanced.path',
        name: '',
        label: '',
        icon: '',
        type: 'secondary',
        showToolbar: true,
        active: false
      },
      {
        route: 'root.at.project.node.advanced',
        name: '',
        label: '',
        icon: '',
        type: 'secondary',
        showToolbar: true,
        active: false
      },
      {
        route: 'root.at.project.node.advanced.general',
        name: '',
        label: '',
        icon: '',
        type: 'secondary',
        showToolbar: true,
        active: false
      },
      {
        route: 'root.at.project.node.advanced.json',
        name: '',
        label: '',
        icon: '',
        type: 'secondary',
        showToolbar: true,
        active: false
      },
      {
        route: 'root.at.project.advanced',
        name: '',
        label: '',
        icon: '',
        type: 'secondary',
        showToolbar: true,
        active: false
      },
      {
        route: 'root.at.project.rubric',
        name: '',
        label: '',
        icon: '',
        type: 'secondary',
        showToolbar: true,
        active: false
      },
      {
        route: 'root.at.project.node.edit-rubric',
        name: '',
        label: '',
        icon: '',
        type: 'secondary',
        showToolbar: true,
        active: false
      }
    ];
    this.processUI();

    this.$transitions.onSuccess({}, ($transition) => {
      this.isMenuOpen = false;
      this.processUI();
      if ($transition.name === 'root.at.main') {
        this.saveEvent('projectListViewed', 'Navigation');
      }
    });

    this.subscriptions.add(
      this.SessionService.showSessionWarning$.subscribe(() => {
        const confirm = this.$mdDialog
          .confirm()
          .parent(angular.element(document.body))
          .theme('at')
          .title(this.$translate('sessionTimeout'))
          .content(this.$translate('autoLogoutMessage'))
          .ariaLabel(this.$translate('sessionTimeout'))
          .ok(this.$translate('yes'))
          .cancel(this.$translate('no'));
        this.$mdDialog.show(confirm).then(
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

    this.subscriptions.add(
      this.ProjectService.savingProject$.subscribe(() => {
        this.setGlobalMessage(this.$translate('saving'), true, null);
      })
    );

    this.subscriptions.add(
      this.ProjectService.projectSaved$.subscribe(() => {
        /*
         * Wait half a second before changing the message to 'Saved' so that
         * the 'Saving...' message stays up long enough for the author to
         * see that the project is saving. If we don't perform this wait,
         * it will always say 'Saved' and authors may wonder whether the
         * project ever gets saved.
         */
        this.$timeout(() => {
          this.setGlobalMessage(this.$translate('SAVED'), false, new Date().getTime());
        }, 500);
      })
    );

    this.subscriptions.add(
      this.ProjectService.errorSavingProject$.subscribe(() => {
        this.setGlobalMessage(this.$translate('errorSavingProject'), false, null);
      })
    );

    this.subscriptions.add(
      this.ProjectService.notAllowedToEditThisProject$.subscribe(() => {
        this.setGlobalMessage(this.$translate('notAllowedToEditThisProject'), false, null);
      })
    );

    this.subscriptions.add(
      this.TeacherDataService.currentNodeChanged$.subscribe(({ currentNode }) => {
        const currentStateName = this.$state.$current.name;
        if (
          currentStateName === 'root.at.project' ||
          currentStateName.startsWith('root.at.project.node')
        ) {
          if (currentNode) {
            this.$state.go('root.at.project.node', { nodeId: currentNode.id });
          } else {
            this.$state.go('root.at.project', { projectId: this.projectId });
          }
        }
      })
    );

    if (this.$state.current.name === 'root.at.main') {
      this.saveEvent('projectListViewed', 'Navigation');
    }

    if (!this.ConfigService.getConfigParam('canEditProject')) {
      this.$timeout(() => {
        this.setGlobalMessage(this.$translate('notAllowedToEditThisProject'), false, null);
      }, 1000);
    }
  }

  $onDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Update UI items based on state, show or hide relevant menus and toolbars
   * TODO: remove/rework this and put items in their own ui states?
   */
  processUI() {
    this.$anchorScroll('top');
    this.showStepTools = [
      'root.at.project',
      'root.at.project.node',
      'root.at.project.node.advanced',
      'root.at.project.node.advanced.branch',
      'root.at.project.node.advanced.constraint',
      'root.at.project.node.advanced.general',
      'root.at.project.node.advanced.json',
      'root.at.project.node.advanced.path'
    ].includes(this.$state.$current.name);
    const view = this.views.find((view: any) => view.route === this.$state.$current.name);
    if (view) {
      this.currentViewName = view.name;
      this.showToolbar = view.showToolbar;
    } else {
      this.currentViewName = '';
      this.showToolbar = false;
    }
    this.projectId = this.ConfigService.getProjectId();
    this.runId = this.ConfigService.getRunId();
    this.runCode = this.ConfigService.getRunCode();
    if (this.projectId) {
      this.projectTitle = this.ProjectService.getProjectTitle();
    } else {
      this.projectTitle = null;
    }
    this.turnOffJSONValidMessage();
  }

  turnOffJSONValidMessage() {
    this.NotificationService.hideJSONValidMessage();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  mouseMoved() {
    this.SessionService.mouseMoved();
  }

  exit() {
    this.ProjectService.notifyAuthorProjectEnd().then(() => {
      window.location.href = `${this.ConfigService.getWISEBaseURL()}/teacher`;
    });
  }

  setGlobalMessage(message, isProgressIndicatorVisible, time) {
    const globalMessage = {
      text: message,
      isProgressIndicatorVisible: isProgressIndicatorVisible,
      time: time
    };
    this.NotificationService.broadcastSetGlobalMessage({ globalMessage: globalMessage });
  }

  logOut() {
    this.saveEvent('logOut', 'Navigation').then(() => {
      this.SessionService.logOut();
    });
  }

  saveEvent(eventName, category): any {
    const context = 'AuthoringTool';
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

  goToView(route: string): void {
    this.$state.go(route);
  }
}

export const AuthoringToolComponent = {
  templateUrl: `/assets/wise5/authoringTool/authoringTool.html`,
  controller: AuthoringToolController
};
