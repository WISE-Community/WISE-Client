import { Component } from '@angular/core';

@Component({
  templateUrl: './register-microsoft-user-already-exists.component.html'
})
export class RegisterMicrosoftUserAlreadyExistsComponent {
  protected login(): void {
    window.location.href = `/api/microsoft-login?redirectUrl=/`;
  }
}
