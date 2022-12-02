declare var google: any;
import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { ConfigService } from '../../../services/config.service';
import { GoogleUser } from '../GoogleUser';

@Component({
  selector: 'google-sign-in-button',
  templateUrl: 'google-sign-in-button.component.html'
})
export class GoogleSignInButtonComponent implements OnInit {
  @Output() signedIn = new EventEmitter<GoogleUser>();
  @Input() text: string = 'signin_with';

  constructor(private configService: ConfigService, private ngZone: NgZone) {}

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: this.configService.getGoogleClientId(),
      callback: ({ credential }) => {
        this.ngZone.run(() => {
          this.signedIn.emit(jwt_decode(credential));
        });
      }
    });
    google.accounts.id.renderButton(document.getElementById('buttonDiv'), {
      text: this.text,
      theme: 'filled_blue',
      size: 'medium'
    });
  }
}
