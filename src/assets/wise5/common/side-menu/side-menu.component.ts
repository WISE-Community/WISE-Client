import { Component, Input } from '@angular/core';
import { MainMenuComponent } from '../main-menu/main-menu.component';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent extends MainMenuComponent {
  @Input() views: any[];
}
