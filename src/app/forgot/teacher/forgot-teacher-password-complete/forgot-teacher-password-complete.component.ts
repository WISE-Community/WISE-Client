import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-teacher-password-complete',
  templateUrl: './forgot-teacher-password-complete.component.html',
  styleUrls: ['./forgot-teacher-password-complete.component.scss']
})
export class ForgotTeacherPasswordCompleteComponent implements OnInit {
  @Input() username: string;

  constructor(private router: Router) {}

  ngOnInit() {}

  goToLoginPage() {
    this.router.navigate(['/login', { username: this.username }]);
  }
}
