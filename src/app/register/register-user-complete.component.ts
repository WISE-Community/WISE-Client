import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '../services/config.service';

@Component({
  template: ''
})
export abstract class RegisterUserCompleteComponent implements OnInit {
  protected googleLogInURL = `${this.configService.getContextPath()}/api/google-login`;
  protected isUsingGoogleId: boolean;
  protected username: string;

  constructor(
    protected configService: ConfigService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ username, isUsingGoogleId }) => {
      this.username = username;
      this.isUsingGoogleId = isUsingGoogleId === 'true';
    });
  }

  protected login(): void {
    this.router.navigate(['/login', { username: this.username }]);
  }
}
