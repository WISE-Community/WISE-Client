import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { EditComponentFieldComponent } from '../edit-component-field.component';

@Component({
  imports: [FormsModule, MatButtonToggleModule, MatIconModule, MatTooltipModule],
  selector: 'edit-component-width',
  template: `<div class="flex items-center gap-2 my-2">
      <span i18n>Activity width</span>
      <mat-icon
        tabindex="0"
        matTooltip="The activity's width determines how it appears on the screen. If two adjacent
        activities are set to 50% each (or 67% and 33%, for example), they will appear side-by-side."
        matTooltipPosition="above"
        i18n-matTooltip
        >help</mat-icon
      >
    </div>
    <mat-button-toggle-group
      [(ngModel)]="selectedValue"
      (change)="onWidthChange()"
      aria-label="Activity width"
      hideSingleSelectionIndicator="true"
    >
      @for (value of possibleValues; track $index) {
        <mat-button-toggle value="{{ value }}">{{ value }}%</mat-button-toggle>
      }
    </mat-button-toggle-group>`
})
export class EditComponentWidthComponent extends EditComponentFieldComponent {
  protected possibleValues = [25, 33, 50, 67, 75, 100];
  protected selectedValue = '100';

  public override ngOnInit(): void {
    super.ngOnInit();
    this.selectedValue = String(this.componentContent.componentWidth ?? 100);
  }

  protected onWidthChange(): void {
    this.componentContent.componentWidth = Number(this.selectedValue);
    this.inputChanged.next(Number(this.selectedValue));
  }
}
