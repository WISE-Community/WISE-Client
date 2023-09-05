import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'node-with-move-after-button',
  templateUrl: './node-with-move-after-button.component.html'
})
export class NodeWithMoveAfterButtonComponent {
  @Input() protected disabled: boolean;
  @Output() protected insertEvent = new EventEmitter();
  @Input() protected nodeId: string;
}
