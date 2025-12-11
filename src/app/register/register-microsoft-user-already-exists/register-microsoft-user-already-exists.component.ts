import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [MatCard, MatCardContent, MatCardActions, MatButton],
  templateUrl: './register-microsoft-user-already-exists.component.html'
})
export class RegisterMicrosoftUserAlreadyExistsComponent {
  protected login(): void {
    window.location.href = `/api/microsoft-login?redirectUrl=/`;
  }
}
