import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'delete-choice-button',
  templateUrl: 'delete-choice-button.component.html',
  styleUrls: ['delete-choice-button.component.scss']
})
export class DeleteChoiceButton {
  @Input()
  buckets: any;

  @Input()
  isDisabled: boolean;

  @Input()
  item: any;

  @Output()
  onItemDeleted = new EventEmitter<void>();

  deleteChoice(): void {
    if (confirm($localize`Are you sure you want to delete this item?`)) {
      for (const bucket of this.buckets) {
        const items = bucket.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === this.item.id) {
            items.splice(i, 1);
          }
        }
      }
      this.onItemDeleted.next();
    }
  }
}
