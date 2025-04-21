import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatIconModule, RouterModule],
  selector: 'app-features',
  styleUrl: './features.component.scss',
  templateUrl: './features.component.html'
})
export class FeaturesComponent {}
