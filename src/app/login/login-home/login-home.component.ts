import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ConfigService } from '../../services/config.service';
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha-2';
import { lastValueFrom } from 'rxjs';
import { MatCard, MatCardContent } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDivider } from '@angular/material/divider';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  imports: [
    MatCard,
    MatCardContent,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatButton,
    MatProgressBar,
    MatDivider,
    RouterLink,
    RecaptchaV3Module
  ],
  selector: 'app-login-home',
  styleUrl: './login-home.component.scss',
  templateUrl: './login-home.component.html'
})
export class LoginHomeComponent implements OnInit {
  accessCode: string = '';
  credentials: any = { username: '', password: '', recaptchaResponse: null };
  protected googleAuthenticationEnabled: boolean = false;
  isRecaptchaEnabled: boolean = false;
  isRecaptchaVerificationFailed: boolean = false;
  isReLoginDueToErrorSavingData: boolean;
  protected microsoftAuthenticationEnabled: boolean;
  passwordError: boolean = false;
  processing: boolean = false;
  @ViewChild('recaptchaRef', { static: false }) recaptchaRef: any;
  private resendEmailEndpoint = '/api/teacher/register/send-verify-email';
  private resendEmailInterval: any;
  protected resendEmailWaitSeconds = signal<number>(0);
  protected showEmailSentConfirmation = signal<boolean>(false);
  protected showTeacherVerificationFailed = signal<boolean>(false);
  protected showSocialLogin: boolean;
  protected showVerificationResend = signal<boolean>(false);
  protected showVerifiedConfirmation = signal<boolean>(false);

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private recaptchaV3Service: ReCaptchaV3Service,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe((config) => {
      if (config != null) {
        this.googleAuthenticationEnabled = config.googleClientId != '';
        this.microsoftAuthenticationEnabled = config.microsoftClientId != '';
      }
      if (this.userService.isSignedIn()) {
        this.router.navigateByUrl(this.getRedirectUrl(''));
      }
      this.showSocialLogin =
        this.googleAuthenticationEnabled || this.microsoftAuthenticationEnabled;
    });
    this.route.params.subscribe((params) => {
      if (params['username'] != null) {
        this.credentials.username = params['username'];
        this.showSocialLogin = false;
      }
    });
    this.route.queryParams.subscribe((params) => {
      if (params['username'] != null) {
        this.credentials.username = params['username'];
      }
      if (params['accessCode'] != null) {
        this.accessCode = params['accessCode'];
      }
      if (params['verified'] != null) {
        this.showVerifiedConfirmation.set(params['verified'] === 'true');
      }
    });
    this.isReLoginDueToErrorSavingData = this.isRedirectToAppRoutes();
    this.isRecaptchaEnabled = this.configService.isRecaptchaEnabled();

    this.resendEmailInterval = setInterval(() => {
      this.resendEmailWaitSeconds.update((current) => current - 1);
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.resendEmailInterval);
  }

  private isRedirectToAppRoutes(): boolean {
    const regExp = RegExp('/student/unit|/teacher/manage|/teacher/edit');
    return regExp.test(this.getRedirectUrl(''));
  }

  async login(): Promise<void> {
    this.processing = true;
    this.passwordError = false;
    this.showVerifiedConfirmation.set(false);
    this.showEmailSentConfirmation.set(false);
    if (this.isRecaptchaEnabled) {
      this.credentials.recaptchaResponse = await lastValueFrom(
        this.recaptchaV3Service.execute('importantAction')
      );
    }
    this.userService.isVerified(this.credentials.username).subscribe((isVerified) => {
      if (isVerified) {
        this.authenticateUser();
      } else {
        this.processing = false;
        this.credentials.password = '';
        this.showTeacherVerificationFailed.set(true);
      }
    });
  }

  private authenticateUser(): void {
    this.userService.authenticate(this.credentials, (response: any) => {
      if (this.userService.isAuthenticated) {
        this.router.navigateByUrl(this.getRedirectUrl(''));
      } else {
        this.processing = false;
        this.credentials.password = '';
        if (response.isRecaptchaVerificationFailed) {
          this.isRecaptchaVerificationFailed = true;
        } else {
          this.passwordError = true;
        }
      }
    });
  }

  public socialSignIn(socialPlatform: string) {
    window.location.href = this.getRedirectUrl(socialPlatform);
  }

  recaptchaResolved(recaptchaResponse) {
    this.credentials.recaptchaResponse = recaptchaResponse;
  }

  getRedirectUrl(social: string): string {
    let redirectUrl = '';
    if (social === 'google') {
      redirectUrl = `${this.configService.getContextPath()}/api/google-login?redirectUrl=${this.userService.getRedirectUrl()}`;
    } else if (social === 'microsoft') {
      redirectUrl = `/api/microsoft-login?redirectUrl=/`;
    } else {
      redirectUrl = this.userService.getRedirectUrl();
    }
    if (this.accessCode !== '') {
      redirectUrl = this.appendAccessCodeParameter(redirectUrl);
    }
    return redirectUrl;
  }

  private appendAccessCodeParameter(url: string): string {
    return `${url}${url.includes('?') ? '&' : '?'}accessCode=${this.accessCode}`;
  }

  protected toggleShowVerificationResend(e: Event): void {
    e.preventDefault();
    this.showVerificationResend.update((current) => !current);
  }

  protected allowResendEmail(): boolean {
    return this.resendEmailWaitSeconds() <= 0;
  }

  protected resendEmail(e: Event): void {
    e.preventDefault();
    const params = new HttpParams().set('username', this.credentials.username);
    this.http
      .post<String>(`${this.resendEmailEndpoint}`, null, { params })
      .subscribe((response) => {
        this.showTeacherVerificationFailed.set(false);
        this.resendEmailWaitSeconds.set(10);
        this.showEmailSentConfirmation.set(true);
      });
  }
}
