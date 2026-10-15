import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatChipsModule],
  selector: 'color-chooser',
  styleUrl: './color-chooser.component.scss',
  templateUrl: './color-chooser.component.html'
})
export class ColorChooserComponent {
  readonly color = model<string>('');
  protected colorOptions: string[] = [
    '#66BB6A',
    '#009688',
    '#00B0FF',
    '#1565C0',
    '#673AB7',
    '#AB47BC',
    '#E91E63',
    '#D50000',
    '#F57C00',
    '#FBC02D',
    '#795548',
    '#757575'
  ];
}
