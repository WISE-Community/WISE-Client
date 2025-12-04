import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [CommonModule, MatTooltipModule],
  selector: 'alert-status-corner',
  styleUrl: 'alert-status-corner.scss',
  templateUrl: 'alert-status-corner.component.html'
})
export class AlertStatusCornerComponent {
  @Input() hasNewAlert: boolean;
  @Input() message: string;
}
