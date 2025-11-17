import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'add-choice-button',
  template: `
    <button
      mat-mini-fab
      color="primary"
      (click)="onClick.next()"
      [disabled]="isDisabled"
      matTooltip="Add item"
      matTooltipPosition="above"
      i18n-matTooltip
    >
      <mat-icon>add</mat-icon>
    </button>
  `
})
export class AddChoiceButtonComponent {
  @Input() isDisabled: boolean;
  @Output() onClick = new EventEmitter<void>();
}
