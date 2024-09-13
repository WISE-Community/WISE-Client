import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { NotificationService } from '../../../../services/notificationService';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'authoring-tool-bar',
  templateUrl: './authoring-tool-bar.component.html',
  styleUrls: ['./authoring-tool-bar.component.scss']
})
export class AuthoringToolBarComponent {
  protected globalMessage: any = {};
  protected isJSONValid: boolean = null;
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
        asset: $localize`File Manager`,
        info: $localize`Unit Info`,
        milestones: $localize`Milestones`,
        notebook: $localize`Notebook Settings`
      }[path] ?? $localize`Authoring Tool`;
    const stepToolPathsFragments = ['advanced', 'branch', 'constraint', 'node'];
    this.showStepTools = this.router.url
      .split('/')
      .some((path) => stepToolPathsFragments.includes(path));
  }

  protected toggleMenu(): void {
    this.onMenuToggle.emit();
  }
}
