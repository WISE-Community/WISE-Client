import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'nav-item-progress',
  styleUrls: ['nav-item-progress.component.scss'],
  templateUrl: 'nav-item-progress.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NavItemProgressComponent {
  @Input()
  nodeCompletion: string;

  @Input()
  period: any;
}
