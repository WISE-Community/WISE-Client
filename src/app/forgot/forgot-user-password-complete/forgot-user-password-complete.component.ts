import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'forgot-user-password-complete',
  templateUrl: './forgot-user-password-complete.component.html'
})
export class ForgotUserPasswordCompleteComponent {
  @Input() username: string;

  constructor(private router: Router) {}

  protected goToLoginPage(): void {
    this.router.navigate(['/login', { username: this.username }]);
  }
}
