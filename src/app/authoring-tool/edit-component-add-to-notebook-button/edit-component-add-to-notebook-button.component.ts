import { Component } from '@angular/core';
import { EditComponentFieldComponent } from '../edit-component-field.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, MatCheckboxModule],
  selector: 'edit-component-add-to-notebook-button',
  styles: ['mat-checkbox { margin-top: 4px; margin-bottom: 4px; }'],
  template: `<mat-checkbox
    color="primary"
    [(ngModel)]="componentContent.showAddToNotebookButton"
    (ngModelChange)="inputChanged.next($event)"
    i18n
  >
    Show Add to Notebook Button
  </mat-checkbox>`
})
export class EditComponentAddToNotebookButtonComponent extends EditComponentFieldComponent {}
