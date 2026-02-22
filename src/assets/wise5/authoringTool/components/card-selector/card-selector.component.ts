import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  selector: 'card-selector',
  styleUrl: './card-selector.component.scss',
  templateUrl: './card-selector.component.html'
})
export class CardSelectorComponent {
  @Input() items: any[] = [];
  @Output() itemSelected: any = new EventEmitter();
  @Input() previewProjectUrl: string;
  private selectedItem: any;

  protected isItemSelected(item: any): boolean {
    return item === this.selectedItem;
  }

  protected previewItem(item: any): void {
    window.open(`${this.previewProjectUrl}/${item.id}`, '_blank');
  }

  selectItem(item: any): void {
    this.selectedItem = item;
    this.itemSelected.next(item);
  }
}
