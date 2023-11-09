import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-student-password-complete',
  templateUrl: './forgot-student-password-complete.component.html',
  styleUrls: ['./forgot-student-password-complete.component.scss']
})
export class ForgotStudentPasswordCompleteComponent {
  @Input() username: string;

  constructor(private router: Router) {}

  goToLoginPage() {
    this.router.navigate(['/login', { username: this.username }]);
  }
}
