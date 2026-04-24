import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import Color from 'colorjs.io';

@Component({
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatIconModule],
  selector: 'tag',
  styleUrl: './tag.component.scss',
  templateUrl: './tag.component.html'
})
export class TagComponent implements OnChanges {
  @Input() allowRemove: boolean;
  @Input() color: string;
  @Output() removeTagEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() text: string;
  protected textColor: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.color?.currentValue) {
      this.textColor = this.getContrastColor(this.color);
    }
  }

  private getContrastColor(color: string): string {
    const colorObj = new Color(color);
    return colorObj.contrast('#FFFFFF', 'WCAG21') < 4.5 ? '#000000' : '#FFFFFF';
  }
}
