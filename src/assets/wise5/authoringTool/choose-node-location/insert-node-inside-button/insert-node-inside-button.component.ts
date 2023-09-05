import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'insert-node-inside-button',
  templateUrl: './insert-node-inside-button.component.html'
})
export class InsertNodeInsideButtonComponent {
  @Output() protected insertEvent = new EventEmitter();
}
