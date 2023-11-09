import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-teacher-password-complete',
  templateUrl: './forgot-teacher-password-complete.component.html',
  styleUrls: ['./forgot-teacher-password-complete.component.scss']
})
export class ForgotTeacherPasswordCompleteComponent {
  @Input() username: string;

  constructor(private router: Router) {}

  goToLoginPage() {
    this.router.navigate(['/login', { username: this.username }]);
  }
}
