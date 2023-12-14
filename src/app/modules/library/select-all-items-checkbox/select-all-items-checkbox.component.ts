import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';

@Component({
  selector: 'select-all-items-checkbox',
  templateUrl: './select-all-items-checkbox.component.html',
  providers: [{ provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }]
})
export class SelectAllItemsCheckboxComponent {
  @Input() label: string = $localize`items`;
  @Input() selectedAllItems: boolean = false;
  @Input() selectedSomeItems: boolean = false;
  @Output() selectAllItemsEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected select(): void {
    this.selectAllItemsEvent.emit(!(this.selectedAllItems || this.selectedSomeItems));
  }
}
