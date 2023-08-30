import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'node-with-move-after-button',
  template: `<div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="8px">
    <node-icon-and-title [nodeId]="nodeId"></node-icon-and-title>
    <insert-node-after-button
      [disabled]="disabled"
      (insertEvent)="insertEvent.emit()"
    ></insert-node-after-button>
  </div>`
})
export class NodeWithMoveAfterButtonComponent {
  @Input() protected disabled: boolean;
  @Output() protected insertEvent = new EventEmitter();
  @Input() protected nodeId: string;
}
