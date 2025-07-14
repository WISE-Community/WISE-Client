import { Component } from '@angular/core';
import { EditComponentFieldComponent } from '../edit-component-field.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  imports: [FormsModule, MatCheckboxModule],
  selector: 'edit-component-exclude-from-total-score',
  styles: ['mat-checkbox { margin-top: 4px; margin-bottom: 4px; }'],
  template: `<mat-checkbox
    color="primary"
    [(ngModel)]="componentContent.excludeFromTotalScore"
    (change)="inputChanged.next($event)"
    i18n
  >
    Do not count score on this activity towards the total score
  </mat-checkbox> `
})
export class EditComponentExcludeFromTotalScoreComponent extends EditComponentFieldComponent {}
