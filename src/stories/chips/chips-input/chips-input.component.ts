import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

export interface Color {
  name: string;
}

@Component({
  selector: 'chips-input',
  templateUrl: 'chips-input.component.html',
  imports: [MatFormFieldModule, MatChipsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipsInputComponent {
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly colors = signal<Color[]>([{ name: 'Blue' }, { name: 'Red' }, { name: 'Green' }]);
  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.colors.update((colors) => [...colors, { name: value }]);
    }
    event.chipInput!.clear();
  }

  remove(color: Color): void {
    this.colors.update((colors) => {
      const index = colors.indexOf(color);
      if (index < 0) {
        return colors;
      }
      colors.splice(index, 1);
      this.announcer.announce(`Removed ${color.name}`);
      return [...colors];
    });
  }

  edit(color: Color, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.remove(color);
      return;
    }
    this.colors.update((colors) => {
      const index = colors.indexOf(color);
      if (index >= 0) {
        colors[index].name = value;
        return [...colors];
      }
      return colors;
    });
  }
}
