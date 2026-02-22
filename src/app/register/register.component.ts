import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {}
