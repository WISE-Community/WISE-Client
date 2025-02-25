import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notificationService';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    imports: [CommonModule, FlexLayoutModule, MatProgressSpinnerModule],
    selector: 'save-indicator',
    styleUrl: './save-indicator.component.scss',
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
