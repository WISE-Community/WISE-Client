import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  imports: [CommonModule, MatChipsModule],
  selector: 'color-chooser',
  standalone: true,
  styleUrl: './color-chooser.component.scss',
  templateUrl: './color-chooser.component.html'
})
export class ColorChooserComponent {
  @Output() chooseColorEvent: EventEmitter<string> = new EventEmitter();
  @Input() chosenColor: string;
  protected colors: string[] = [
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
