import { Component } from '@angular/core';
import { EditComponentFieldComponent } from '../edit-component-field.component';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  imports: [FormsModule, MatSliderModule],
  selector: 'edit-component-width',
  template: `<span i18n>Activity width:</span>
    <mat-slider
      min="0"
      [max]="possibleValues.length - 1"
      step="1"
      discrete
      showTickMarks
      [displayWith]="formatLabel"
      style="min-width: 300px;"
    >
      <input matSliderThumb (input)="onSliderChange($event)" [value]="selectedIndex" />
    </mat-slider>
    <span>{{ selectedValue }}%</span>
    <p i18n>
      *Setting the activities' widths determines how they appear on the screen. For example, if two
      adjacent activities' widths are both set to 50%, they will appear side-by-side.
    </p>`
})
export class EditComponentWidthComponent extends EditComponentFieldComponent {
  protected possibleValues = [25, 33, 50, 66, 75, 100];
  protected selectedIndex = 0;
  protected selectedValue = this.possibleValues[0];

  public override ngOnInit(): void {
    super.ngOnInit();
    this.selectedValue = this.componentContent.componentWidth ?? 100;
    this.selectedIndex = this.possibleValues.indexOf(this.selectedValue);
  }

  protected formatLabel = (index: number): string => `${this.possibleValues[index]}%`;

  protected onSliderChange(event: any): void {
    this.selectedValue = this.possibleValues[event.target.value];
    this.componentContent.componentWidth = this.selectedValue;
    this.inputChanged.next(this.selectedValue);
  }
}
