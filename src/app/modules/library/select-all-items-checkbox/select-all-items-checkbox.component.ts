import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';

type SelectAllItemsStatus = 'none' | 'some' | 'all';

@Component({
  selector: 'select-all-items-checkbox',
  templateUrl: './select-all-items-checkbox.component.html',
  providers: [{ provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }]
})
export class SelectAllItemsCheckboxComponent {
  @Output() allSelectedEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() noneSelectedEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() numAllItems: number;
  @Input() numSelectedItems: number;
  protected status: SelectAllItemsStatus;
  @Input() tooltip: string;

  ngOnChanges(): void {
    if (this.numSelectedItems == 0) {
      this.status = 'none';
    } else if (this.numSelectedItems < this.numAllItems) {
      this.status = 'some';
    } else {
      this.status = 'all';
    }
  }

  protected select(): void {
    if (this.status === 'none') {
      this.allSelectedEvent.emit();
    } else {
      this.noneSelectedEvent.emit();
    }
  }
}
