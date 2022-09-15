import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
  @Input() state: any;
  @Input() title: string;
  @Input() views: any[];

  constructor() {}

  ngOnInit(): void {}

  goToView(view: any): void {
    if (view.action != null) {
      view.action();
    }
    this.state.go(view.route);
  }
}
