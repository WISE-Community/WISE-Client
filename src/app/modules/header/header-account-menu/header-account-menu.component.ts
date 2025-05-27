import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClient } from '@angular/common/http';
import { LogOutService } from '../../../services/logOutService';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { User } from '../../../domain/user';

@Component({
  selector: 'app-header-account-menu',
  templateUrl: './header-account-menu.component.html',
  styleUrl: './header-account-menu.component.scss',
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    RouterModule
  ]
})
export class HeaderAccountMenuComponent {
  protected firstName: string = '';
  protected isPreviousAdmin: boolean;
  protected lastName: string = '';
  protected roles: string[] = [];
  private switchToOriginalUserURL = '/api/logout/impersonate';
  @Input() user: User;

  constructor(
    private http: HttpClient,
    private logOutService: LogOutService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user) {
      const user = changes.user.currentValue;
      if (user) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.roles = user.roles;
        this.isPreviousAdmin = user.isPreviousAdmin;
      }
    }
  }

  protected switchToAdmin(): void {
    window.location.href = '/admin';
  }

  protected switchToOriginalUser(): void {
    this.http.post(this.switchToOriginalUserURL, {}).subscribe(() => {
      window.location.href = '/teacher';
    });
  }

  protected logOut(): void {
    this.logOutService.logOut();
  }
}
