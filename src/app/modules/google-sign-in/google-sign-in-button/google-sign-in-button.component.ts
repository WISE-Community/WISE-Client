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
  selector: 'google-sign-in-button',
  styleUrls: ['google-sign-in-button.component.scss'],
  templateUrl: 'google-sign-in-button.component.html',
  encapsulation: ViewEncapsulation.None
})
export class GoogleSignInButtonComponent implements AfterViewInit {
  @Output() signedIn = new EventEmitter<GoogleUser>();
  @Input() text: string = 'signin_with';
  @ViewChild('googleButton') private googleButton: ElementRef;

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
