import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NodeIconAndTitleComponent } from '../node-icon-and-title/node-icon-and-title.component';
import { InsertNodeAfterButtonComponent } from '../insert-node-after-button/insert-node-after-button.component';

@Component({
  imports: [InsertNodeAfterButtonComponent, NodeIconAndTitleComponent],
  selector: 'node-with-move-after-button',
  template: `
    <div class="flex flex-row justify-start items-center gap-2">
      <node-icon-and-title [nodeId]="nodeId" />
      <insert-node-after-button [disabled]="disabled" (insertEvent)="insertEvent.emit()" />
    </div>
  `
})
export class NodeWithMoveAfterButtonComponent {
  @Input() protected disabled: boolean;
  @Output() protected insertEvent = new EventEmitter();
  @Input() protected nodeId: string;
}
