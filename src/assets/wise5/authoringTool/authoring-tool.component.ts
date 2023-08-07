import { Component, HostListener } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { Subscription } from 'rxjs';
import { ConfigService } from '../services/configService';
import { NotificationService } from '../services/notificationService';
import { TeacherProjectService } from '../services/teacherProjectService';
import { SessionService } from '../services/sessionService';
import { TeacherDataService } from '../services/teacherDataService';

@Component({
  templateUrl: './authoring-tool.component.html'
})
export class AuthoringToolComponent {
  private $mdDialog: any;
  protected $state: any;
  private $transitions: any;
  private $timeout: any;
  protected currentViewName: string;
  protected isMenuOpen: boolean = false;
  protected logoPath: string;
  protected projectId: number;
  protected projectTitle: string;
  protected runId: number;
  protected runCode: string;
  protected showStepTools: boolean = false;
  protected showToolbar: boolean = true;
  protected title: string = $localize`Authoring Tool`;
  private subscriptions: Subscription = new Subscription();
  protected views = [
    {
      route: 'root.at.project',
      id: 'projectHomeButton',
      name: $localize`Unit Home`,
      label: $localize`Unit Home`,
      icon: 'home',
      type: 'primary',
      showToolbar: true,
      active: true
    },
    {
      route: 'root.at.project.info',
      id: 'infoButton',
      name: $localize`Unit Info`,
      label: $localize`Unit Info`,
      icon: 'info',
      type: 'primary',
      showToolbar: true,
      active: true
    },
    {
      route: 'root.at.project.asset',
      id: 'assetButton',
      name: $localize`File Manager`,
      label: $localize`File Manager`,
      icon: 'attach_file',
      type: 'primary',
      showToolbar: true,
      active: true
    },
    {
      route: 'root.at.project.notebook',
      id: 'notebookButton',
      name: $localize`Notebook Settings`,
      label: $localize`Notebook Settings`,
      icon: 'book',
      type: 'primary',
      showToolbar: true,
      active: true
    },
    {
      route: 'root.at.project.milestones',
      id: 'milestonesButton',
      name: $localize`Milestones`,
      label: $localize`Milestones`,
      icon: 'flag',
      type: 'primary',
      showToolbar: true,
      active: true
    },
    {
      route: 'root.at.main',
      id: 'projectListButton',
      name: $localize`Unit List`,
      label: $localize`Unit List`,
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
      route: 'root.at.project.node.advanced.rubric',
      name: '',
      label: '',
      icon: '',
      type: 'secondary',
      showToolbar: true,
      active: false
    }
  ];

  constructor(
    private configService: ConfigService,
    private notificationService: NotificationService,
    private projectService: TeacherProjectService,
    private sessionService: SessionService,
    private dataService: TeacherDataService,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit(): void {
    this.$mdDialog = this.upgrade.$injector.get('$mdDialog');
    this.$state = this.upgrade.$injector.get('$state');
    this.$transitions = this.upgrade.$injector.get('$transitions');
    this.$timeout = this.upgrade.$injector.get('$timeout');
    this.logoPath = this.projectService.getThemePath() + '/images/WISE-logo-ffffff.svg';
    this.processUI();

    if (!this.configService.getConfigParam('canEditProject')) {
      this.$timeout(() => {
        this.setGlobalMessage(
          $localize`You do not have permission to edit this unit.`,
          false,
          null
        );
      }, 1000);
    }

    this.$transitions.onSuccess({}, () => {
      this.isMenuOpen = false;
      this.processUI();
    });

    this.subscribeToSessionEvents();
    this.subscribeToProjectEvents();
    this.subscribeToDataEvents();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToSessionEvents(): void {
    this.subscriptions.add(
      this.sessionService.showSessionWarning$.subscribe(() => {
        const confirm = this.$mdDialog
          .confirm()
          .theme('at')
          .title($localize`Session Timeout`)
          .content(
            $localize`You have been inactive for a long time. Do you want to stay logged in?`
          )
          .ariaLabel($localize`Session Timeout`)
          .ok($localize`Yes`)
          .cancel($localize`No`);
        this.$mdDialog.show(confirm).then(
          () => {
            this.sessionService.closeWarningAndRenewSession();
          },
          () => {
            this.logOut();
          }
        );
      })
    );

    this.subscriptions.add(
      this.sessionService.logOut$.subscribe(() => {
        this.logOut();
      })
    );
  }

  private subscribeToProjectEvents(): void {
    this.subscriptions.add(
      this.projectService.savingProject$.subscribe(() => {
        this.setGlobalMessage($localize`Saving...`, true, null);
      })
    );

    this.subscriptions.add(
      this.projectService.projectSaved$.subscribe(() => {
        /*
         * Wait half a second before changing the message to 'Saved' so that
         * the 'Saving...' message stays up long enough for the author to
         * see that the project is saving. If we don't perform this wait,
         * it will always say 'Saved' and authors may wonder whether the
         * project ever gets saved.
         */
        this.$timeout(() => {
          this.setGlobalMessage($localize`Saved`, false, new Date().getTime());
        }, 500);
      })
    );

    this.subscriptions.add(
      this.projectService.errorSavingProject$.subscribe(() => {
        this.setGlobalMessage($localize`Error Saving Unit. Please refresh the page.`, false, null);
      })
    );

    this.subscriptions.add(
      this.projectService.notAllowedToEditThisProject$.subscribe(() => {
        this.setGlobalMessage(
          $localize`You do not have permission to edit this unit.`,
          false,
          null
        );
      })
    );
  }

  private subscribeToDataEvents(): void {
    this.subscriptions.add(
      this.dataService.currentNodeChanged$.subscribe(({ currentNode }) => {
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
  }

  /**
   * Update UI items based on state, show or hide relevant menus and toolbars
   * TODO: remove/rework this and put items in their own ui states?
   */
  private processUI(): void {
    document.getElementById('top').scrollIntoView();
    this.showStepTools = [
      'root.at.project',
      'root.at.project.node',
      'root.at.project.node.advanced',
      'root.at.project.node.advanced.branch',
      'root.at.project.node.advanced.rubric',
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
    this.projectId = this.configService.getProjectId();
    this.runId = this.configService.getRunId();
    this.runCode = this.configService.getRunCode();
    if (this.projectId) {
      this.projectTitle = this.projectService.getProjectTitle();
    } else {
      this.projectTitle = null;
    }
    this.notificationService.hideJSONValidMessage();
  }

  protected toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:mousemove')
  protected renewSession(): void {
    this.sessionService.mouseMoved();
  }

  private setGlobalMessage(message: string, progressIndicatorVisible: boolean, time: number): void {
    this.notificationService.broadcastSetGlobalMessage({
      globalMessage: {
        text: message,
        isProgressIndicatorVisible: progressIndicatorVisible,
        time: time
      }
    });
  }

  private logOut(): void {
    this.sessionService.logOut();
  }
}
