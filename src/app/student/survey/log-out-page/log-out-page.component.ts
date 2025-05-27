import { Component } from '@angular/core';
import { LogOutService } from '../../../services/logOutService';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'logout',
  imports: [MatCardModule, MatIconModule, MatMenuModule],
  templateUrl: './log-out-page.component.html',
  styleUrl: './log-out-page.component.scss'
})
export class LogOutPageComponent {
  constructor(private logOutService: LogOutService) {}

  protected logOut(): void {
    this.logOutService.logOut();
  }
}
