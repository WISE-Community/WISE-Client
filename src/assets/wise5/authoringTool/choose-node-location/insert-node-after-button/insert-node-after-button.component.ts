import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'insert-node-after-button',
  templateUrl: './insert-node-after-button.component.html'
})
export class InsertNodeAfterButtonComponent {
  @Input() protected disabled: boolean;
  @Output() protected insertEvent = new EventEmitter();
}
