import { Component } from '@angular/core';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  inputs: ['views'],
  selector: 'side-menu',
  standalone: true,
  styleUrl: './side-menu.component.scss',
  templateUrl: './side-menu.component.html'
})
export class SideMenuComponent extends MainMenuComponent {}
