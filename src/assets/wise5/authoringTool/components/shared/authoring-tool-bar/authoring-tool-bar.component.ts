import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { NotificationService } from '../../../../services/notificationService';
import { NavigationEnd, Router } from '@angular/router';
import { SaveIndicatorComponent } from '../../../../common/save-indicator/save-indicator.component';
import { MatIconModule } from '@angular/material/icon';
import { StepToolsComponent } from '../../../../common/stepTools/step-tools.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    SaveIndicatorComponent,
    StepToolsComponent
  ],
  selector: 'authoring-tool-bar',
  styleUrl: './authoring-tool-bar.component.scss',
  templateUrl: './authoring-tool-bar.component.html'
})
export class AuthoringToolBarComponent {
  protected globalMessage: any = {};
  protected isJSONValid: boolean;
  @Output() private onMenuToggle: EventEmitter<void> = new EventEmitter<void>();
  protected showStepTools: boolean;
  private subscriptions: Subscription = new Subscription();
  protected viewName: string;

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.processUI();
    this.subscribeToNotifications();
    this.subscribeToRouterEvents();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToNotifications(): void {
    this.subscriptions.add(
      this.notificationService.setGlobalMessage$.subscribe(({ globalMessage }) => {
        this.globalMessage = globalMessage;
      })
    );
    this.subscriptions.add(
      this.notificationService.setIsJSONValid$.subscribe(({ isJSONValid }) => {
        this.isJSONValid = isJSONValid;
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
    const path = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
    this.viewName =
      {
        advanced: $localize`Advanced Settings`,
        asset: $localize`File Manager`,
        info: $localize`Unit Info`,
        milestones: $localize`Milestones`,
        notebook: $localize`Notebook Settings`
      }[path] ?? $localize`Authoring Tool`;
    const stepToolPathsFragments = ['branch', 'constraint', 'node'];
    this.showStepTools = this.router.url
      .split('/')
      .some((path) => stepToolPathsFragments.includes(path));
  }

  protected toggleMenu(): void {
    this.onMenuToggle.emit();
  }
}
