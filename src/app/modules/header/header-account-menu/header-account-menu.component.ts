import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { User } from '../../../domain/user';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-header-account-menu',
  templateUrl: './header-account-menu.component.html',
  styleUrl: './header-account-menu.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    RouterModule
  ]
})
export class HeaderAccountMenuComponent implements OnInit {
  protected firstName: string = '';
  protected isPreviousAdmin: boolean;
  protected lastName: string = '';
  protected logOutURL: string;
  protected roles: string[] = [];
  private switchToOriginalUserURL = '/api/logout/impersonate';
  @Input() user: User;

  constructor(private configService: ConfigService, private http: HttpClient) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe((config) => {
      this.logOutURL = config.logOutURL;
    });
  }

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
    this.http.get(this.logOutURL).subscribe(() => {
      window.location.href = '/';
    });
  }
}
