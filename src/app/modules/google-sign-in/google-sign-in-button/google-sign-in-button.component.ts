declare var google: any;
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import jwt_decode from 'jwt-decode';
import { ConfigService } from '../../../services/config.service';
import { GoogleUser } from '../GoogleUser';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'google-sign-in-button',
  standalone: true,
  styleUrl: 'google-sign-in-button.component.scss',
  template: '<div #googleButton class="googleButton center"></div>'
})
export class GoogleSignInButtonComponent implements AfterViewInit {
  @ViewChild('googleButton') private googleButton: ElementRef;
  @Output() signedIn = new EventEmitter<GoogleUser>();
  @Input() text: string = 'signin_with';

  constructor(private configService: ConfigService, private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: this.configService.getGoogleClientId(),
      callback: ({ credential }) => {
        this.ngZone.run(() => {
          this.signedIn.emit(jwt_decode(credential));
        });
      }
    });
    google.accounts.id.renderButton(this.googleButton.nativeElement, {
      text: this.text,
      theme: 'filled_blue',
      size: 'medium'
    });
  }
}
