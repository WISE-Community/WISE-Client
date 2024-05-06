import { Component, Input, SimpleChanges } from '@angular/core';
import { User } from '../../../domain/user';
import { CommonModule } from '@angular/common';
import { HeaderSigninComponent } from '../header-signin/header-signin.component';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-header-links',
  imports: [CommonModule, FlexLayoutModule, HeaderSigninComponent, MatButtonModule, RouterModule],
  templateUrl: './header-links.component.html',
  styleUrl: './header-links.component.scss'
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
