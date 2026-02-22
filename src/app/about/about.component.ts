import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatIconModule],
  selector: 'app-about',
  styleUrl: './about.component.scss',
  templateUrl: './about.component.html'
})
export class AboutComponent {}
