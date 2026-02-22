import { Component } from '@angular/core';
import { EditComponentFieldComponent } from '../edit-component-field.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  selector: 'edit-component-max-submit',
  styles: ['mat-form-field { margin-top: 10px; margin-bottom: 10px; }'],
  template: `<mat-form-field>
    <mat-label i18n>Max Submit</mat-label>
    <input
      matInput
      type="number"
      min="1"
      [(ngModel)]="componentContent.maxSubmitCount"
      (ngModelChange)="inputChanged.next($event)"
    />
  </mat-form-field>`
})
export class EditComponentMaxSubmitComponent extends EditComponentFieldComponent {}
