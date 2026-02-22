import { Component } from '@angular/core';
import { EditComponentFieldComponent } from '../edit-component-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  selector: 'edit-component-max-score',
  template: `<mat-form-field>
    <mat-label i18n>Max Score</mat-label>
    <input
      matInput
      type="number"
      [(ngModel)]="componentContent.maxScore"
      (ngModelChange)="inputChanged.next($event)"
    />
  </mat-form-field> `
})
export class EditComponentMaxScoreComponent extends EditComponentFieldComponent {}
