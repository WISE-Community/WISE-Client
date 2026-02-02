import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
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
  private activatedRoute = inject(ActivatedRoute);

  googleUserNotFoundError: boolean;
  protected microsoftUserNotFoundError: boolean;

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.googleUserNotFoundError = params['googleUserNotFound'] === 'true';
      this.microsoftUserNotFoundError = params['microsoftUserNotFound'] === 'true';
    });
  }
}
