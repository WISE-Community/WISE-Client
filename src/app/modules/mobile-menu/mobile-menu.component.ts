import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UtilService } from '../../services/util.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatDividerModule, MatIconModule, RouterModule],
  selector: 'app-mobile-menu',
  styleUrl: './mobile-menu.component.scss',
  templateUrl: './mobile-menu.component.html'
})
export class MobileMenuComponent implements OnInit {
  private userService = inject(UserService);
  private utilService = inject(UtilService);

  protected signedIn: boolean;

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
