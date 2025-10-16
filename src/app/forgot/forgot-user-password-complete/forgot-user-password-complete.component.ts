import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  imports: [MatCard, MatCardContent, MatButton],
  templateUrl: './forgot-user-password-complete.component.html'
})
export class ForgotUserPasswordCompleteComponent {
  @Input() username: string;

  constructor(private router: Router) {}

  protected goToLoginPage(): void {
    this.router.navigate(['/login', { username: this.username }]);
  }
}
