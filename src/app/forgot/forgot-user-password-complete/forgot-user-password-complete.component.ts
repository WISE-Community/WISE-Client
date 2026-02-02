import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  imports: [MatCard, MatCardContent, MatButton],
  templateUrl: './forgot-user-password-complete.component.html'
})
export class ForgotUserPasswordCompleteComponent {
  private router = inject(Router);

  @Input() username: string;

  protected goToLoginPage(): void {
    this.router.navigate(['/login', { username: this.username }]);
  }
}
