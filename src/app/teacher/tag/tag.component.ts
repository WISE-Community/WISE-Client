import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ColorService } from '../../../assets/wise5/services/colorService';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'tag',
  standalone: true,
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent implements OnChanges {
  @Input() color: string;
  @Input() text: string;
  protected textColor: string;

  constructor(private colorService: ColorService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.color?.currentValue) {
      this.textColor = this.colorService.getContrastColor(this.color);
    }
  }
}
