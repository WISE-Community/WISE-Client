import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
  @Input() title: string;
  @Input() views: any = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {}

  protected goToView(view: any): void {
    if (view.action != null) {
      view.action();
    }
    this.router.navigate(view.route, { relativeTo: this.route });
  }
}
