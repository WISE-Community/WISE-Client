import { ChangeDetectionStrategy, Component, computed, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'chips-autocomplete',
  templateUrl: 'chips-autocomplete.component.html',
  imports: [MatFormFieldModule, MatChipsModule, MatIconModule, MatAutocompleteModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipsAutocompleteComponent {
  readonly currentColor = model('');
  readonly colors = signal(['Blue']);
  readonly allColors: string[] = ['Red', 'Green', 'Blue', 'Yellow', 'Orange', 'Purple'];
  readonly filteredColors = computed(() => {
    const currentColor = this.currentColor().toLowerCase();
    const selected = new Set(this.colors().map((color) => color.toLowerCase()));
    const candidates = this.allColors.filter((color) => !selected.has(color.toLowerCase()));
    return currentColor
      ? candidates.filter((color) => color.toLowerCase().includes(currentColor))
      : candidates.slice();
  });

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const exists = this.colors().some((color) => color.toLowerCase() === value.toLowerCase());
      if (!exists) {
        this.colors.update((colors) => [...colors, value]);
      }
    }
    this.currentColor.set('');
  }

  remove(color: string): void {
    this.colors.update((colors) => {
      const index = colors.indexOf(color);
      if (index < 0) {
        return colors;
      }
      colors.splice(index, 1);
      return [...colors];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.viewValue;
    const exists = this.colors().some((c) => c.toLowerCase() === selectedValue.toLowerCase());
    if (!exists) {
      this.colors.update((colors) => [...colors, selectedValue]);
    }
    // clear the input used for filtering
    this.currentColor.set('');
    event.option.deselect();
  }
}
