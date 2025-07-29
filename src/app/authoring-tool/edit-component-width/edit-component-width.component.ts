import { Component } from '@angular/core';
import { EditComponentFieldComponent } from '../edit-component-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  selector: 'edit-component-width',
  template: `<mat-form-field>
    <mat-label i18n>Component Width</mat-label>
    <input
      matInput
      type="number"
      [(ngModel)]="componentContent.componentWidth"
      (ngModelChange)="inputChanged.next($event)"
    />
  </mat-form-field> `
})
export class EditComponentWidthComponent extends EditComponentFieldComponent {}
