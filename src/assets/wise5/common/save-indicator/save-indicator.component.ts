import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notificationService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'save-indicator',
  templateUrl: './save-indicator.component.html',
  styleUrls: ['./save-indicator.component.scss']
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
}
