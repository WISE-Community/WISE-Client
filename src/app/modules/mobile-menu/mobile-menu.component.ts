import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UtilService } from '../../services/util.service';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss'
})
export class MobileMenuComponent implements OnInit {
  protected signedIn: boolean;

  constructor(private userService: UserService, private utilService: UtilService) {}

  ngOnInit(): void {
    this.getUser();
  }

  protected close(): void {
    this.utilService.showMobileMenu(false);
  }

  private getUser(): void {
    this.userService.getUser().subscribe((user) => {
      this.signedIn = user.roles?.length > 0;
    });
  }
}
