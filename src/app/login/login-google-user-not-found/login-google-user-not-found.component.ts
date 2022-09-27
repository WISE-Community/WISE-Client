import { Component } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login-google-user-not-found',
  templateUrl: './login-google-user-not-found.component.html',
  styleUrls: ['./login-google-user-not-found.component.scss']
})
export class LoginGoogleUserNotFoundComponent {
  constructor(
    private socialAuthService: SocialAuthService,
    private userService: UserService,
    private router: Router
  ) {}

  registerTeacherWithGoogle() {
    this.socialSignIn('google', 'join/teacher/form');
  }

  registerStudentWithGoogle() {
    this.socialSignIn('google', 'join/student/form');
  }

  socialSignIn(socialPlatform: string, successPath: string) {
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
          this.router.navigate([successPath, { gID: googleUserID, name: userData.name }]);
        }
      });
    });
  }
}
