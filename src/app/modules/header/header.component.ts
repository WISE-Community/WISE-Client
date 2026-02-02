import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../domain/user';
import { UserService } from '../../services/user.service';
import { UtilService } from '../../services/util.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderLinksComponent } from './header-links/header-links.component';
import { HeaderAccountMenuComponent } from './header-account-menu/header-account-menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  imports: [
    HeaderAccountMenuComponent,
    HeaderLinksComponent,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    RouterModule
  ],
  selector: 'app-header',
  styleUrl: './header.component.scss',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  private utilService = inject(UtilService);

  protected location: string = '';
  protected roles: string[] = [];
  protected user: User;

  constructor() {
    this.router.events.subscribe(() => {
      this.setLocation();
    });
  }

  ngOnInit(): void {
    this.getUser();
    this.setLocation();
  }

  private getUser(): void {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
      this.roles = user.roles ? user.roles : [];
    });
  }

  private setLocation(): void {
    if (this.router.url.match(/^\/teacher/)) {
      this.location = 'teacher';
    } else if (this.router.url.match(/^\/student/)) {
      this.location = 'student';
    } else {
      this.location = '';
    }
  }

  protected showMobileMenu(): void {
    this.utilService.showMobileMenu();
  }
}
