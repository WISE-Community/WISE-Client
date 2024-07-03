import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [FlexLayoutModule, MatProgressBarModule, MatTooltipModule],
  selector: 'project-progress',
  standalone: true,
  templateUrl: './project-progress.component.html'
})
export class ProjectProgressComponent {
  @Input() completed: number;
  @Input() percent: number;
  @Input() total: number;
}
