import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [MatIconModule, MatTooltipModule],
  selector: 'status-icon',
  template: `
    <mat-icon
      class="{{ class }}"
      tabindex="0"
      matTooltip="{{ tooltip }}"
      matTooltipPosition="above"
    >
      {{ name }}
    </mat-icon>
  `
})
export class StatusIconComponent {
  @Input() class: string;
  @Input() name: string;
  @Input() tooltip: string;
}
