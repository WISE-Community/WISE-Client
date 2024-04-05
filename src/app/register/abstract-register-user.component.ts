import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ConfigService } from '../services/config.service';
import { Directive, OnInit } from '@angular/core';
import { GoogleUser } from '../modules/google-sign-in/GoogleUser';

@Directive()
export abstract class AbstractRegisterUserComponent implements OnInit {
  protected googleAuthenticationEnabled: boolean = false;
  protected microsoftAuthenticationEnabled: boolean;
  protected abstract joinFormPath: string;

  constructor(
    private configService: ConfigService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe((config) => {
      if (config != null) {
        this.googleAuthenticationEnabled = this.isSet(config.googleClientId);
        this.microsoftAuthenticationEnabled = this.isSet(config.microsoftClientId);
      }
    });
  }

  private isSet(value: string): boolean {
    return value != null && value != '';
  }

  protected googleSignIn(credential: GoogleUser): void {
    this.userService.isGoogleIdExists(credential.sub).subscribe((isExists) => {
      if (isExists) {
        this.router.navigate(['join/googleUserAlreadyExists']);
      } else {
        this.router.navigate([this.joinFormPath, this.getGoogleFormParams(credential)]);
      }
    });
  }

  protected signUp(): void {
    this.router.navigate([this.joinFormPath, this.getFormParams()]);
  }

  protected microsoftSignIn(): void {
    window.location.href = `/api/microsoft-login?redirectUrl=${this.joinFormPath}`;
  }

  protected abstract getFormParams(): any;

  protected abstract getGoogleFormParams(credential: GoogleUser): any;
}
