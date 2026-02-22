import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  imports: [FormsModule, MatFormFieldModule, MatSelectModule],
  selector: 'edit-connected-component-type-select',
  template: `<mat-form-field>
    <mat-label i18n>Type</mat-label>
    <mat-select
      [(ngModel)]="connectedComponent.type"
      (ngModelChange)="connectedComponentTypeChanged()"
    >
      <mat-option value="importWork" i18n>Import Work</mat-option>
      <mat-option value="showWork" i18n>Show Work</mat-option>
    </mat-select>
  </mat-form-field>`
})
export class EditConnectedComponentTypeSelectComponent {
  @Input() connectedComponent: any;
  @Output() connectedComponentChange: EventEmitter<any> = new EventEmitter();

  protected connectedComponentTypeChanged(): void {
    this.connectedComponentChange.emit(this.connectedComponent);
  }
}
