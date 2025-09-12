import { Component } from '@angular/core';
import { EditComponentFieldComponent } from '../edit-component-field.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  imports: [FormsModule, MatCheckboxModule],
  selector: 'edit-component-submit-button',
  styles: ['mat-checkbox { margin-top: 4px; margin-bottom: 4px; }'],
  template: `<mat-checkbox
    color="primary"
    [(ngModel)]="componentContent.showSubmitButton"
    (change)="inputChanged.next($event)"
    i18n
    >Show Submit Button</mat-checkbox
  > `
})
export class EditComponentSubmitButtonComponent extends EditComponentFieldComponent {}
