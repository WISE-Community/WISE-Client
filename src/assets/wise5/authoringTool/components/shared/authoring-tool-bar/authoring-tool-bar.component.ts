import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../services/notificationService';

@Component({
  selector: 'authoring-tool-bar',
  templateUrl: './authoring-tool-bar.component.html',
  styleUrls: ['./authoring-tool-bar.component.scss']
})
export class AuthoringToolBarComponent {
  protected globalMessage: any = {};
  protected isJSONValid: boolean = null;
  @Output() onMenuToggle: EventEmitter<void> = new EventEmitter<void>();
  @Input() showStepTools: boolean;
  private subscriptions: Subscription = new Subscription();
  @Input() viewName: string;

  constructor(private notificationService: NotificationService) {
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected toggleMenu(): void {
    this.onMenuToggle.emit();
  }
}
