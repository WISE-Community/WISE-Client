import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register-home',
  templateUrl: './register-home.component.html',
  styleUrls: ['./register-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterHomeComponent implements OnInit {
  googleUserNotFoundError: boolean;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.googleUserNotFoundError = params['googleUserNotFound'] === 'true';
    });
  }
}
