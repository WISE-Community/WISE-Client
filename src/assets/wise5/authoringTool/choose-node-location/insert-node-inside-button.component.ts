import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'insert-node-inside-button',
  template: `<button
    mat-raised-button
    color="primary"
    (click)="insertEvent.emit()"
    matTooltip="Insert inside"
    matTooltipPosition="above"
    i18n-matTooltip
  >
    <mat-icon style="margin: 0">call_received</mat-icon>
  </button>`
})
export class InsertNodeInsideButtonComponent {
  @Output() protected insertEvent = new EventEmitter();
}
