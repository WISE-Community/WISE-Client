import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ConfigService } from '../../services/config.service';
import { GoogleUser } from '../../modules/google-sign-in/GoogleUser';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.scss']
})
export class RegisterStudentComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  isGoogleAuthenticationEnabled: boolean = false;
  microsoftAuthenticationEnabled: boolean;

  constructor(
    private configService: ConfigService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe((config) => {
      if (config != null) {
        this.isGoogleAuthenticationEnabled = this.isSet(config.googleClientId);
        this.microsoftAuthenticationEnabled = this.isSet(config.microsoftClientId);
      }
    });
  }

  private isSet(value: string): boolean {
    return value != null && value != '';
  }

  public signUp(): void {
    this.router.navigate([
      'join/student/form',
      { firstName: this.firstName, lastName: this.lastName }
    ]);
  }

  public googleSignIn(credential: GoogleUser): void {
    this.userService.isGoogleIdExists(credential.sub).subscribe((isExists) => {
      if (isExists) {
        this.router.navigate(['join/googleUserAlreadyExists']);
      } else {
        this.router.navigate(['join/student/form', { gID: credential.sub, name: credential.name }]);
      }
    });
  }

  protected microsoftSignIn(): void {
    window.location.href = '/api/microsoft-login?redirectUrl=/join/student/form';
  }
}
