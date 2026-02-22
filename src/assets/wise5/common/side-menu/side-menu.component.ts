import { Component } from '@angular/core';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  inputs: ['views'],
  selector: 'side-menu',
  styleUrl: './side-menu.component.scss',
  templateUrl: './side-menu.component.html'
})
export class SideMenuComponent extends MainMenuComponent {}
