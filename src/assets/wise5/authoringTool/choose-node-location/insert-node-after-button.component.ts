import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'insert-node-after-button',
  template: `<button
    mat-raised-button
    color="primary"
    [disabled]="disabled"
    (click)="insertEvent.emit()"
    matTooltip="Insert after"
    matTooltipPosition="above"
    i18n-matTooltip
  >
    <mat-icon style="margin: 0">subdirectory_arrow_left</mat-icon>
  </button>`
})
export class InsertNodeAfterButtonComponent {
  @Input() protected disabled: boolean;
  @Output() protected insertEvent = new EventEmitter();
}
