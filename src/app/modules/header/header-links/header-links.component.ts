import { Component, Input, SimpleChanges } from '@angular/core';
import { User } from '../../../domain/user';
import { HeaderSigninComponent } from '../header-signin/header-signin.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  imports: [HeaderSigninComponent, MatButtonModule, RouterModule],
  selector: 'app-header-links',
  styleUrl: './header-links.component.scss',
  templateUrl: './header-links.component.html'
})
export class HeaderLinksComponent {
  @Input() location: string;
  protected roles: string[] = [];
  @Input() user: User;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user) {
      let user = changes.user.currentValue;
      this.roles = user.roles ? user.roles : [];
    }
  }
}
