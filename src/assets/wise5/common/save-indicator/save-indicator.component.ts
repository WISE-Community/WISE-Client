import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notificationService';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  imports: [CommonModule, MatProgressSpinnerModule],
  selector: 'save-indicator',
  styles: ['.global-message { margin-right: 20px }'],
  templateUrl: './save-indicator.component.html'
})
export class SaveIndicatorComponent implements OnInit {
  protected globalMessage: any = {};
  private subscriptions: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.notificationService.setGlobalMessage$.subscribe(({ globalMessage }) => {
        this.globalMessage = globalMessage;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
