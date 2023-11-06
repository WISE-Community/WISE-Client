import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-student-password-complete',
  templateUrl: './forgot-student-password-complete.component.html',
  styleUrls: ['./forgot-student-password-complete.component.scss']
})
export class ForgotStudentPasswordCompleteComponent implements OnInit {
  @Input() username: string;

  constructor(private router: Router) {}

  ngOnInit() {}

  goToLoginPage() {
    this.router.navigate(['/login', { username: this.username }]);
  }
}
