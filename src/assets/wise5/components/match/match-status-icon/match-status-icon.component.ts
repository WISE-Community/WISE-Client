import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatIconModule],
  selector: 'match-status-icon',
  standalone: true,
  templateUrl: 'match-status-icon.component.html'
})
export class MatchStatusIconComponent {
  @Input() status: string;
}
