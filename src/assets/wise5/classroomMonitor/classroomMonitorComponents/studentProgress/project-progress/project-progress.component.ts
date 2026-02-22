import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [MatProgressBarModule, MatTooltipModule],
  selector: 'project-progress',
  templateUrl: './project-progress.component.html'
})
export class ProjectProgressComponent {
  @Input() completed: number;
  @Input() percent: number;
  @Input() total: number;
}
