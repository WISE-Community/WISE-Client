import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, MatDividerModule, MatIconModule, MatToolbarModule, MatListModule],
  selector: 'main-menu',
  styles: ['.menu-sidenav__divider { margin: 0px; }'],
  templateUrl: './main-menu.component.html'
})
export class MainMenuComponent {
  @Input() title: string;
  @Input() views: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  protected goToView(view: any): void {
    if (view.action != null) {
      view.action();
    }
    this.router.navigate(view.route, { relativeTo: this.route });
  }
}
