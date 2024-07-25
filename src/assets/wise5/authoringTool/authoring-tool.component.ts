import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { ConfigService } from '../services/configService';
import { NotificationService } from '../services/notificationService';
import { TeacherProjectService } from '../services/teacherProjectService';
import { SessionService } from '../services/sessionService';
import { TeacherDataService } from '../services/teacherDataService';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogWithConfirmComponent } from '../directives/dialog-with-confirm/dialog-with-confirm.component';

@Component({
  styleUrls: ['./authoring-tool.component.scss'],
  templateUrl: './authoring-tool.component.html'
})
export class AuthoringToolComponent {
  protected isMenuOpen: boolean = false;
  protected logoPath: string;
  protected projectId: number;
  protected projectTitle: string;
  protected runId: number;
  protected runCode: string;
  protected showToolbar: boolean = true;
  protected title: string = $localize`Authoring Tool`;
  protected views: any[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private dialog: MatDialog,
    private elem: ElementRef,
    private notificationService: NotificationService,
    private projectService: TeacherProjectService,
    private renderer: Renderer2,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.logoPath = this.projectService.getThemePath() + '/images/WISE-logo-ffffff.svg';
    this.processUI();
    this.initializeViews();
    this.subscribeToSessionEvents();
    this.subscribeToProjectEvents();
    this.subscribeToDataEvents();
    this.subscribeToRouterEvents();
    this.subscribeToUIChangeEvents();
    this.checkPermission();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeViews(): void {
    this.views = [
      {
        route: ['unit', this.projectId],
        name: $localize`Unit Home`,
        icon: 'home',
        type: 'primary',
        active: true
      },
      {
        route: ['unit', this.projectId, 'info'],
        name: $localize`Unit Info`,
        icon: 'info',
        type: 'primary',
        active: true
      },
      {
        route: ['unit', this.projectId, 'asset'],
        name: $localize`File Manager`,
        icon: 'attach_file',
        type: 'primary',
        active: true
      },
      {
        route: ['unit', this.projectId, 'notebook'],
        name: $localize`Notebook Settings`,
        icon: 'book',
        type: 'primary',
        active: true
      },
      {
        route: ['unit', this.projectId, 'milestones'],
        name: $localize`Milestones`,
        icon: 'flag',
        type: 'primary',
        active: true
      },
      {
        route: ['unit', this.projectId, 'advanced'],
        name: $localize`Advanced Settings`,
        icon: 'build',
        type: 'primary',
        active: true
      },
      {
        route: ['home'],
        name: $localize`Unit List`,
        icon: 'reorder',
        type: 'primary',
        active: true
      }
    ];
  }

  private subscribeToSessionEvents(): void {
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
          .subscribe((isRenew: boolean) => {
            if (isRenew) {
              this.sessionService.closeWarningAndRenewSession();
            } else {
              this.logOut();
            }
          });
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
        setTimeout(() => {
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
        this.router.navigate(
          currentNode
            ? [`/teacher/edit/unit/${this.projectId}/node/${currentNode.id}`]
            : [`/teacher/edit/unit/${this.projectId}`]
        );
      })
    );
  }

  private subscribeToRouterEvents(): void {
    this.subscriptions.add(
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        this.processUI();
        this.initializeViews();
      })
    );
  }

  private subscribeToUIChangeEvents(): void {
    this.subscriptions.add(
      this.projectService.uiChanged$.subscribe(() => {
        setTimeout(() => {
          if (this.projectService.isDefaultLocale()) {
            this.enableElements();
          } else {
            this.disableElements();
          }
        }, 500);
      })
    );
  }

  private enableElements(): void {
    this.getElements().forEach((element) => {
      this.renderer.removeAttribute(element, 'disabled');
      this.renderer.removeStyle(element, 'pointer-events');
    });
  }

  private disableElements(): void {
    this.getElements()
      .filter((element) => !element.classList.contains('enable-in-translation'))
      .forEach((element) => {
        this.renderer.setAttribute(element, 'disabled', 'true');
        this.renderer.setStyle(element, 'pointer-events', 'none');
      });
  }

  private getElements(): any[] {
    return Array.from(
      this.elem.nativeElement.querySelectorAll(
        'div.main-content button,input[type=radio],input[type=checkbox],input[type=number],mat-checkbox,mat-icon[cdkdraghandle]'
      )
    );
  }

  private checkPermission(): void {
    if (!this.configService.getConfigParam('canEditProject')) {
      setTimeout(() => {
        this.setGlobalMessage(
          $localize`You do not have permission to edit this unit.`,
          false,
          null
        );
      }, 1000);
    }
  }

  private processUI(): void {
    document.getElementById('top').scrollIntoView();
    this.showToolbar = this.router.url.startsWith('/teacher/edit/unit');
    this.isMenuOpen = false;
    if (!this.showToolbar) {
      delete this.projectId;
      delete this.runId;
      delete this.runCode;
    } else {
      this.projectId = this.configService.getProjectId();
      this.runId = this.configService.getRunId();
      this.runCode = this.configService.getRunCode();
    }
    if (this.projectId) {
      this.projectTitle = this.projectService.getProjectTitle();
    } else {
      this.projectTitle = null;
    }
    this.notificationService.hideJSONValidMessage();
    this.projectService.uiChanged();
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
