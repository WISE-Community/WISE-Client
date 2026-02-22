import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [MatProgressBarModule, MatTooltipModule],
  selector: 'nav-item-progress',
  templateUrl: 'nav-item-progress.component.html'
})
export class NavItemProgressComponent {
  @Input() nodeCompletion: string;
}
