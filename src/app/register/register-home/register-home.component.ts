import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CallToActionComponent } from '../../modules/shared/call-to-action/call-to-action.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [CallToActionComponent],
  selector: 'app-register-home',
  styleUrl: './register-home.component.scss',
  templateUrl: './register-home.component.html'
})
export class RegisterHomeComponent implements OnInit {
  googleUserNotFoundError: boolean;
  protected microsoftUserNotFoundError: boolean;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.googleUserNotFoundError = params['googleUserNotFound'] === 'true';
      this.microsoftUserNotFoundError = params['microsoftUserNotFound'] === 'true';
    });
  }
}
