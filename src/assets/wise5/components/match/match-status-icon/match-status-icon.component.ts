import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatIconModule],
  selector: 'match-status-icon',
  template: `
    @switch (status) {
      @case ('correct') {
        <mat-icon class="mat-18" aria-label="Correct" i18n-aria-label>check</mat-icon>
      }
      @case ('warn') {
        <mat-icon class="mat-18" aria-label="Warning" i18n-aria-label>warning</mat-icon>
      }
      @case ('incorrect') {
        <mat-icon class="mat-18" aria-label="Incorrect" i18n-aria-label>clear</mat-icon>
      }
    }
  `
})
export class MatchStatusIconComponent {
  @Input() status: string;
}
