import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'card-selector',
  templateUrl: './card-selector.component.html',
  styleUrls: ['./card-selector.component.scss']
})
export class CardSelectorComponent implements OnInit {
  @Input()
  items: any[] = [];

  @Input()
  previewProjectUrl: string;

  @Output()
  itemSelected: any = new EventEmitter();

  selectedItem: any;

  constructor() {}

  ngOnInit(): void {}

  isItemSelected(item: any): boolean {
    return item === this.selectedItem;
  }

  previewItem(item: any): void {
    window.open(`${this.previewProjectUrl}/${item.id}`, '_blank');
  }

  selectItem(item: any): void {
    this.selectedItem = item;
    this.itemSelected.next(item);
  }
}
