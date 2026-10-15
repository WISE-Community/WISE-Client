import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import Color from 'colorjs.io';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  selector: 'tag',
  styleUrl: './tag.component.scss',
  templateUrl: './tag.component.html'
})
export class TagComponent {
  readonly allowRemove = input<boolean>(false);
  readonly color = input<string>('');
  readonly removeTagEvent = output<void>();
  readonly text = input<string>('');

  protected textColor = computed(() => {
    const color = this.color();
    if (!color) {
      return '';
    }
    return this.getContrastColor(color);
  });

  private getContrastColor(color: string): string {
    const colorObj = new Color(color);
    return colorObj.contrast('#FFFFFF', 'WCAG21') < 4.5 ? '#000000' : '#FFFFFF';
  }
}
