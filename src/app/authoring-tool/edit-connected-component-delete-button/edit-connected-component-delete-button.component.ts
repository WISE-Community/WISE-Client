import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'edit-connected-component-delete-button',
  styles: ['.mat-icon { margin: 0px; }'],
  template: `<button
    mat-raised-button
    color="primary"
    (click)="deleteConnectedComponent()"
    matTooltip="Delete"
    matTooltipPosition="above"
    i18n-matTooltip
  >
    <mat-icon>delete</mat-icon>
  </button> `
})
export class EditConnectedComponentDeleteButtonComponent {
  @Input() connectedComponentIndex: number;
  @Output() connectedComponentChange: EventEmitter<any> = new EventEmitter();

  protected deleteConnectedComponent(): void {
    this.connectedComponentChange.emit(this.connectedComponentIndex);
  }
}
