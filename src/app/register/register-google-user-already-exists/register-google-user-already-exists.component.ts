import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { MatCard, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [MatCard, MatCardContent, MatCardActions, MatButton],
  selector: 'app-register-google-user-already-exists',
  templateUrl: './register-google-user-already-exists.component.html',
  styleUrl: './register-google-user-already-exists.component.scss'
})
export class RegisterGoogleUserAlreadyExistsComponent {
  constructor(private configService: ConfigService) {}

  public socialSignIn(socialPlatform: string) {
    window.location.href = `${this.configService.getContextPath()}/api/google-login`;
  }
}
