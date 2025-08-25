import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [FlexLayoutModule, MatProgressBarModule, MatTooltipModule],
  selector: 'nav-item-progress',
  styleUrl: 'nav-item-progress.component.scss',
  templateUrl: 'nav-item-progress.component.html'
})
export class NavItemProgressComponent {
  @Input() nodeCompletion: string;
  @Input() period: any;
}
