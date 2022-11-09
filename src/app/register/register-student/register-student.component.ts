import { Component, OnInit } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.scss']
})
export class RegisterStudentComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  isGoogleAuthenticationEnabled: boolean = false;

  constructor(
    private socialAuthService: SocialAuthService,
    private userService: UserService,
    private configService: ConfigService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe((config) => {
      if (config != null) {
        this.isGoogleAuthenticationEnabled = config.googleClientId != null;
      }
    });
  }

  public signUp(): void {
    this.router.navigate([
      'join/student/form',
      { firstName: this.firstName, lastName: this.lastName }
    ]);
  }

  public socialSignIn(socialPlatform: string): void {
    let socialPlatformProvider;
    if (socialPlatform == 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then((userData) => {
      const googleUserID = userData.id;
      this.userService.isGoogleIdExists(googleUserID).subscribe((isExists) => {
        if (isExists) {
          this.router.navigate(['join/googleUserAlreadyExists']);
        } else {
          this.router.navigate(['join/student/form', { gID: googleUserID, name: userData.name }]);
        }
      });
    });
  }
}
