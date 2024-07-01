import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ColorService } from '../../../assets/wise5/services/colorService';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatIconModule],
  selector: 'tag',
  standalone: true,
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent implements OnChanges {
  @Input() allowRemove: boolean;
  @Input() color: string;
  @Output() removeTagEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() text: string;
  protected textColor: string;

  constructor(private colorService: ColorService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.color?.currentValue) {
      this.textColor = this.colorService.getContrastColor(this.color);
    }
  }
}
