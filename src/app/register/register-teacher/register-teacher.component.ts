import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ConfigService } from '../../services/config.service';
import { GoogleUser } from '../../modules/google-sign-in/GoogleUser';

@Component({
  selector: 'app-register-teacher',
  templateUrl: './register-teacher.component.html',
  styleUrls: ['./register-teacher.component.scss']
})
export class RegisterTeacherComponent implements OnInit {
  email: string = '';
  isGoogleAuthenticationEnabled: boolean = false;

  constructor(
    private configService: ConfigService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.configService.getConfig().subscribe((config) => {
      if (config != null) {
        this.isGoogleAuthenticationEnabled = config.googleClientId != null;
      }
    });
  }

  public signUp() {
    this.router.navigate(['join/teacher/form', { email: this.email }]);
  }

  public googleSignIn(credential: GoogleUser): void {
    this.userService.isGoogleIdExists(credential.sub).subscribe((isExists) => {
      if (isExists) {
        this.router.navigate(['join/googleUserAlreadyExists']);
      } else {
        this.router.navigate([
          'join/teacher/form',
          { gID: credential.sub, name: credential.name, email: credential.email }
        ]);
      }
    });
  }
}
