import { Directive, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '../services/config.service';

@Directive()
export abstract class RegisterUserCompleteComponent implements OnInit {
  protected googleLogInURL = `${this.configService.getContextPath()}/oauth2/authorization/google`;
  protected microsoftLogInURL = `${this.configService.getContextPath()}/api/microsoft-login?redirectUrl=/`;
  protected socialAccount: boolean;
  protected isUsingGoogleId: boolean;
  protected isUsingMicrosoftId: boolean;
  protected username: string;

  constructor(
    protected configService: ConfigService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ username, isUsingGoogleId, isUsingMicrosoftId }) => {
      this.username = username;
      this.isUsingGoogleId = isUsingGoogleId === 'true';
      this.isUsingMicrosoftId = isUsingMicrosoftId === 'true';
      this.socialAccount = this.isUsingGoogleId || this.isUsingMicrosoftId;
    });
  }

  protected login(): void {
    this.router.navigate(['/login', { username: this.username }]);
  }
}
