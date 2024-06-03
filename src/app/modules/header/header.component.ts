import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../domain/user';
import { UserService } from '../../services/user.service';
import { UtilService } from '../../services/util.service';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderLinksComponent } from './header-links/header-links.component';
import { HeaderAccountMenuComponent } from './header-account-menu/header-account-menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  imports: [
    CommonModule,
    FlexLayoutModule,
    HeaderAccountMenuComponent,
    HeaderLinksComponent,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    RouterModule
  ],
  selector: 'app-header',
  standalone: true,
  styleUrl: './header.component.scss',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  protected location: string = '';
  protected roles: string[] = [];
  protected user: User;

  constructor(
    private router: Router,
    private userService: UserService,
    private utilService: UtilService
  ) {
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
