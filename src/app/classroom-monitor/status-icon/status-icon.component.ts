import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [MatIconModule, MatTooltipModule],
  selector: 'status-icon',
  standalone: true,
  templateUrl: 'status-icon.component.html'
})
export class StatusIconComponent {
  @Input() class: string;
  @Input() name: string;
  @Input() tooltip: string;
}
