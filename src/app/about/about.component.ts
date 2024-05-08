import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, FlexLayoutModule, MatButtonModule, MatIconModule],
  selector: 'app-about',
  standalone: true,
  styleUrl: './about.component.scss',
  templateUrl: './about.component.html'
})
export class AboutComponent {}
